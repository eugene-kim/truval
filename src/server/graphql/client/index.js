const fs = require('fs');
const {introspectionQuery} = require('graphql/utilities');
const {graphql} = require('graphql');
const gqlSchema = require('../schema');
const {parse} = require('graphql/language/parser');
const {visit} = require('graphql/language/visitor');
const {Schema} = require('normalizr');
const {normalize, schema} = require('normalizr');

const queryResult = require('./sampleQueryResult.json');

module.exports = async () => {
  const queryString = `query {
    session(id:1) {
      isComplete,
      activities {
        name
      }
    }
    user(id:1) {
      id,
      username
    }
  }`;

  const fieldTypes = {
    OBJECT: 'OBJECT',
    LIST: 'LIST',
  };

  const stack = [];
  const schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
  const schemaDoc = schemaDocumentWhole.data.__schema;
  const queryAST = parse(queryString);
  const normalizrSchema = {};
  const visitor = {
    Document(node) {
      if (node.definitions.length > 1) {
        console.error('Multiple operations not supported at the moment.');
      }
    },
    OperationDefinition: {
      enter(node) {
        const {operation} = node;
        const operationKey = `${operation}Type`;
        const operationName = schemaDoc[operationKey].name;

        if (!operationName) {
          console.error(`${operationKey} is not a valid operation!`);
        }

        operationSchema = schemaDoc.types.find(type => type.name === operationName);

        // console.log(`${operationName} schema: ${operationSchema}`);
      },
    },
    Field: {
      enter(node) {
        debugger;
        
        // Skip over scalar fields - normalizr automatically adds those properties in.
        if (isScalarNode(node)) {
          return false;
        }

        const fieldName = getFieldName(node);
        const operationRootField = getOpRootField(node, operationSchema);
        const nodeGqlSchema = getNodeGqlSchema(node, schemaDoc, operationSchema, operationRootField);
        const nodeNormalizrSchema = createNormalizrSchema(node, nodeGqlSchema.type);

        // Assign the schema to the proper parent.
        if (operationRootField) { /* This field is the root field on the operation. */
          Object.assign(normalizrSchema, {[fieldName]: nodeNormalizrSchema});
        } else { /* This is a child field on an operation. */
          const parentNormalizrSchema = getCurrentParent(stack);
          const parentNormalizrSchemaDefinition = parentNormalizrSchema.schema;

          // Update the parent schema definition to include this child schema.
          Object.assign(parentNormalizrSchemaDefinition, {[fieldName]: nodeNormalizrSchema});
          parentNormalizrSchema.define(parentNormalizrSchemaDefinition);
        }

        stack.push(nodeNormalizrSchema);
      },

      leave() {
        stack.pop();
      },
    },
  };

  const getOpRootField = (node, opSchema) => opSchema.fields.find(field => field.name === getFieldName(node));

  const getNodeGqlSchema = (node, schemaDoc, opSchema, isOpRootField) => {
    return isOpRootField ? getOpRootFieldGqlSchema(node, schemaDoc, opSchema) : getOpChildFieldGqlSchema(node, schemaDoc);
  }

  const getOpRootFieldGqlSchema = (node, schemaDoc, opSchema) => {
    return opSchema.fields.find(opFieldSchema => getFieldName(node) === opFieldSchema.name);
  }

  const getOpChildFieldGqlSchema = (node, schemaDoc) => {
    return schemaDoc.types.find(schemaType => schemaType.name === getFieldName(node));
  }

  const createNormalizrSchema = (node, {kind, name, ofType}) => {
    const fieldName = getFieldName(node);

    if (kind === fieldTypes.OBJECT) {
      return new schema.Entity(fieldName);
    } else if (kind === fieldTypes.LIST) {
      const instanceSchema = new schema.Entity(fieldName);

      return new schema.Array(instanceSchema);
    } else {
      throw `Unidentified field kind for node ${getFieldName(node)} - ${node}`;
    }
  }

  const isScalarNode = node => !isEntityNode(node);
  const isEntityNode = node => !!node.selectionSet;
  const getFieldName = node => node.name.value;
  const getCurrentParent = stack => stack.length > 1 ? stack[stack.length - 1] : stack[0];

  visit(queryAST, visitor);

  return normalize(queryResult, {data: normalizrSchema});
}