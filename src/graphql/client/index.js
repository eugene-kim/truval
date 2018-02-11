import {normalize} from 'normalizr';
import {graphql} from 'graphql';
import {parse} from 'graphql/language/parser';
import {introspectionQuery} from 'graphql/utilities';

import normalizeGql from './normalizeGql';
import gqlSchema from '../schema/typeDefSchema';
import reduxify from './reduxify';
import containsQueryData from './containsQueryData';

import { UPDATE_FROM_SERVER } from 'redux/actions/types';


export default ({endpoint = 'http://localhost:3000/graphql'} = {}) => {

  return {
    // TODO: Consider being able to dynamically determine if query or mutation.
    query: async (query, store, options = {}) => {
      const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
      const schemaDoc = schemaDocumentWhole.data.__schema;
      const gqlOperationAST = parse(query);
      const storeContainsQueryData = containsQueryData(gqlOperationAST, schemaDoc, store);

      if (!storeContainsQueryData) {
        const normalizrSchema = await normalizeGql(gqlOperationAST, schemaDoc);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',  
            },
            body: JSON.stringify({query}),
          });

          const responseBody = response._bodyText;
          const gqlResponse = JSON.parse(responseBody);
          const normalizedData = normalize(gqlResponse, normalizrSchema);
          const reduxFriendlyData = reduxify(normalizedData, gqlOperationAST, schemaDoc);

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
  };
}