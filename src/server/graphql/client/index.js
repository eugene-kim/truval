const {normalize} = require('normalizr');
const request = require('request-promise');

// TODO: Remove this once you've got the actual query portion of the client complete.
const queryResult = require('./gqlNormalizer/sampleQueryResult.json');
const mutationResult = require('./gqlNormalizer/sampleMutationResult.json');
const normalizeGql = require('./gqlNormalizer');
const {parse} = require('graphql/language/parser');

module.exports = {
  query: async (query, options = {}) => {
    const normalizrSchema = await normalizeGql(query);
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

  mutate: async (mutation, options = {}) => {
    const normalizrSchema = await normalizeGql(mutation);
    const requestOptions = {
      method: 'POST',
      uri: 'http://localhost:3000/graphql',
      body: JSON.stringify({query: mutation}),
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