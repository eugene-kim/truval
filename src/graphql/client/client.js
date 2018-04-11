import {normalize} from 'normalizr';
import {graphql} from 'graphql';
import {parse} from 'graphql/language/parser';
import {introspectionQuery} from 'graphql/utilities';
import invariant from 'invariant';

import gqlSchema from '../schema/typeDefSchema';
import reduxify from './reduxify';
import containsQueryData from './containsQueryData';
import fetch from 'node-fetch';

import { UPDATE_FROM_SERVER } from 'src/redux/actions/types';


export default ({endpoint = 'http://localhost:3000/graphql', store} = {}) => {

  invariant(
    store,
    `A Redux store must be provided to construct the client!`,
  );

  return {
    query: async function(queryString, options = {}) {
      const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
      const schemaDoc = schemaDocumentWhole.data.__schema;
      const queryAST = parse(queryString);
      const storeContainsQueryData = containsQueryData(queryAST, schemaDoc, store);

      if (storeContainsQueryData) {
        console.log('Store contains query data - no need to make GraphQL request.');

        return {};
      } else {
        console.log('Store does not contain query data - making a request to the GraphQL server.');

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',  
            },
            body: JSON.stringify({query: queryString}),
          });

          const {status} = response;

          const responseBody = await response.json();

          invariant(
            status === 200,
            `GraphQL operation failed! Status: ${status}\nReason:${responseBody}`,
          );

          const reduxFriendlyData = await reduxify(responseBody, queryAST, schemaDoc);

          store.dispatch({
            type: UPDATE_FROM_SERVER,
            payload: reduxFriendlyData,
          });

          // TODO: We don't need to be returning back this data when we're using the client.
          // We'll probably we sending back something like a response object indicating the status
          // of the GraphQL request.
          return reduxFriendlyData;
        } catch(error) {
          console.error(error);
        }
      }
    },

    mutate: async function(mutationString, options = {}) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',  
          },
          body: JSON.stringify({query: mutationString}),
        });

        const {status} = response;
        const responseBody = await response.json();

        invariant(
          status === 200,
          `GraphQL operation failed! Status: ${status}\nReason:${responseBody}`,
        );

        if (options.shouldNormalizeData) {
          const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
          const schemaDoc = schemaDocumentWhole.data.__schema;
          const mutationAST = parse(mutationString);
          const normalizedData = await reduxify(responseBody, mutationAST, schemaDoc);
          
          return normalizedData;  
        }

        return responseBody;
      } catch(error) {
        console.error(error);

        throw error;
      }
    },

    getStore: function() {
      return store;
    },
  };
}