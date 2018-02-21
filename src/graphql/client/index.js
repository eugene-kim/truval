import {normalize} from 'normalizr';
import {graphql} from 'graphql';
import {parse} from 'graphql/language/parser';
import {introspectionQuery} from 'graphql/utilities';
import invariant from 'invariant';

import gqlSchema from '../schema/typeDefSchema';
import reduxify from './reduxify';
import containsQueryData from './containsQueryData';

import { UPDATE_FROM_SERVER } from 'redux/actions/types';


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
          const responseBody = response._bodyText;

          invariant(
            status === 200,
            `GraphQL operation failed! Status: ${status}\nReason:${responseBody}`,
          );

          const gqlResponse = JSON.parse(responseBody);
          const reduxFriendlyData = await reduxify(gqlResponse, queryAST, schemaDoc);

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

    mutate: async function(mutationString, action, options = {}) {
      invariant(action, `A Redux action must be provided to mutate().`);

      const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
      const schemaDoc = schemaDocumentWhole.data.__schema;
      const mutationAST = parse(mutationString);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',  
          },
          body: JSON.stringify({query: mutationString}),
        });

        const {status} = response;
        const responseBody = response._bodyText;

        invariant(
          status === 200,
          `GraphQL operation failed! Status: ${status}\nReason:${responseBody}`,
        );

        const gqlResponse = JSON.parse(responseBody);
        const reduxFriendlyData = await reduxify(gqlResponse, mutationAST, schemaDoc);

        // Dispatch the action explicitly associated with the mutation.
        store.dispatch(action);

        // We might as well update the store with the data we retrieved.
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
    },

    getStore: function() {
      return store;
    },
  };
}