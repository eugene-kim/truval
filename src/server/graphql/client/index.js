const fs = require('fs');
const {introspectionQuery} = require('graphql/utilities');
const {graphql} = require('graphql');
const schema = require('../schema');
const { parse } = require('graphql/language/parser');


module.exports = async () => {
  // Print Schema
  const result = await graphql(schema, introspectionQuery);
  fs.writeFileSync('./my_schema.json', JSON.stringify(result));  

  // Parse Query  
  const queryString = `query {
  session(id:1) {
    isComplete,
    activities {
      name,
      session {
        id
      }
    }
  }
  user(id:1) {
    id,
    username
  }
}`;

  const document = parse(queryString);

  fs.writeFileSync('./sample_query_document.json', JSON.stringify(document));  
}