const fs = require('fs');
const {introspectionQuery} = require('graphql/utilities');
const {graphql} = require('graphql');
const gqlSchema = require('../../schema');
const {parse} = require('graphql/language/parser');
const createNormalizrSchema = require('./createNormalizrSchema');

module.exports = async gqlOpString => {

  // The schema document contains all the types in our GraphQL schema, including GraphQL native types.
  try {
    const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
    const schemaDoc = schemaDocumentWhole.data.__schema;
    const gqlOperationAST = parse(gqlOpString);
    const normalizrSchema = createNormalizrSchema(gqlOperationAST, schemaDoc);

    return normalizrSchema;
  } catch(error) {
    console.error(error);
  }
}