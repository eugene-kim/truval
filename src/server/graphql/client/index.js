const {normalize} = require('normalizr');
const request = require('request-promise');
const normalizeGql = require('./normalizeGql');
const {graphql} = require('graphql');
const {parse} = require('graphql/language/parser');
const {introspectionQuery} = require('graphql/utilities');
const gqlSchema = require('../schema');

module.exports = {

  // TODO: Consider being able to dynamically determine if query or mutation.
  query: async (query, options = {}) => {
    const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
    const schemaDoc = schemaDocumentWhole.data.__schema;
    const gqlOperationAST = parse(query);
    
    // TODO: Determine if we need to query the gql server or if we have the data we need.
    // const shouldMakeRequest;

    const normalizrSchema = await normalizeGql(gqlOperationAST, schemaDoc);

    const requestOptions = {
      method: 'POST',
      uri: 'http://localhost:3000/graphql',
      body: JSON.stringify({query}),
      headers: {
        'Content-Type':'application/json',
      },
    };

    try {
      const gqlResponse = await request(requestOptions);
      const responseObject = JSON.parse(gqlResponse);
      const normalizedData = normalize(responseObject, normalizrSchema);

      return normalizedData;
    } catch(error) {
      console.log(error);
    }
  },
}