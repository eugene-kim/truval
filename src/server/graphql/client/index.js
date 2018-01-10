const {normalize} = require('normalizr');
const request = require('request-promise');

// TODO: Remove this once you've got the actual query portion of the client complete.
const queryResult = require('./parser/sampleQueryResult.json');
const mutationResult = require('./parser/sampleMutationResult.json');
const parser = require('./parser');
const {parse} = require('graphql/language/parser');

module.exports = {
  query: async (query, options = {}) => {
    const normalizrSchema = await parser(query);
    const requestOptions = {
      method: 'POST',
      uri: 'http://localhost:3000/graphql',
      body: JSON.stringify({query}),
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },

      // Automatically parse the JSON string in the response.
      json: true,
    };

    try {
      const data = await request(requestOptions);  
      const normalizedData = normalize(data, normalizrSchema);

      return normalizedData;
    } catch(error) {
      console.log(error);
    }
  },

  mutate: async (mutation, options = {}) => {
    const normalizrSchema = await parser(mutation);
    const requestOptions = {
      method: 'POST',
      uri: 'http://localhost:3000/graphql',
      body: JSON.stringify({query: mutation}),
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },

      // Automatically parse the JSON string in the response.
      json: true,
    };

    try {
      const data = await request(requestOptions);  
      const normalizedData = normalize(data, normalizrSchema);

      return normalizedData;
    } catch(error) {
      console.log(error);
    }
  },
}