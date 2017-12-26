const fs = require('fs');
const {introspectionQuery} = require('graphql/utilities');
const {graphql} = require('graphql');
const {normalize} = require('normalizr');
const gqlSchema = require('../../schema');
const {parse} = require('graphql/language/parser');
const createNormalizrSchema = require('./createNormalizrSchema');

const queryResult = require('./sampleQueryResult.json');


module.exports = async gqlOpString => {

  // Returns a schema document containing all the types that our GraphQL schema supports.
  // Includes GraphQL native types.
  const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
  const schemaDoc = schemaDocumentWhole.data.__schema;
  const gqlOperationAST = parse(gqlOpString);
  const normalizrSchema = createNormalizrSchema(gqlOperationAST, schemaDoc);

  return normalize(queryResult, {data: normalizrSchema});
}