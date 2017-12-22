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
    NON_NULL: 'NON_NULL',
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

          // Returning false makes `visit()` skip over this node.
          return false;
        }

        const fieldName = getFieldName(node);
        const operationRootField = getOpRootField(node, operationSchema);

        if (operationRootField) { /* This field is the root field on the operation. */
          console.log('Node is an operation root field.\n');

          const nodeNormalizrSchema = createNormalizrSchema(node, operationRootField.type);
          const fieldType = getNodeFieldType(operationRootField.type);

          Object.assign(normalizrSchema, {[fieldName]: nodeNormalizrSchema});

          console.log(`Adding ${fieldType} to the stack`);

          stack.push({fieldType, nodeNormalizrSchema})

          console.log('stack\n', stack);
        } else { /* This is a descendant field on an operation. */
          console.log('Node is an operation descendant field.\n');

          const parent = getCurrentParent(stack);
          const parentNormalizrSchema = parent.nodeNormalizrSchema;
          const parentFieldType = parent.fieldType;

          console.log('parentFieldType', parentFieldType);

          debugger

          const fieldTypeObject = getChildFieldType(parentFieldType, node, schemaDoc);

          console.log('fieldTypeObject', fieldTypeObject);
          console.log('typeof fieldTypeObject', typeof fieldTypeObject);

          const fieldTypeName = getNodeFieldType(fieldTypeObject);
          const nodeNormalizrSchema = createNormalizrSchema(node, fieldTypeObject);

          // Update the parent schema definition to include this child schema.
          const parentNormalizrSchemaDefinition = parentNormalizrSchema.schema;
          Object.assign(parentNormalizrSchemaDefinition, {[fieldName]: nodeNormalizrSchema});
          parentNormalizrSchema.define(parentNormalizrSchemaDefinition);

          console.log(`Adding ${fieldTypeName} to the stack`);
          stack.push({fieldType: fieldTypeName, nodeNormalizrSchema});

          console.log('stack\n', stack);
        }
      },

      leave() {
        stack.pop();
      },
    },
  };

  const getChildFieldType = (parentFieldType, node, schemaDoc) => {
    const parentSchema = getNodeSchema(parentFieldType, schemaDoc);
    const childField = parentSchema.fields.find(field => field.name === getFieldName(node));

    return childField.type;
  }

  const getOpRootField = (node, opSchema) => opSchema.fields.find(field => field.name === getFieldName(node));

  const getOpRootFieldGqlSchema = (node, schemaDoc, opSchema) => {
    return opSchema.fields.find(opFieldSchema => getFieldName(node) === opFieldSchema.name);
  }

  const getNodeSchema = (typeName, schemaDoc) => {
    return schemaDoc.types.find(schemaType => schemaType.name === typeName);
  }

  // TODO: Expand this method as you come across more types.
  const getNodeFieldType = ({kind, name, ofType}) => {
    console.log(`kind is ${kind}`);
    console.log(`name is ${name}`);
    console.log(`ofType is:\n`, ofType);

    switch(kind) {
      case fieldTypes.NON_NULL:
        return getNodeFieldType(ofType);
      case fieldTypes.LIST:
        return ofType.name;
      case fieldTypes.OBJECT:
        return name;
      default:
        throw `Unknown field kind: ${kind}. Unable to grab node type name.`;
    }
  }

  const createNormalizrSchema = (node, {kind, name, ofType}) => {
    const fieldName = getFieldName(node);
    console.log({kind, name, ofType});

    switch(kind) {
      case fieldTypes.NON_NULL:
        return createNormalizrSchema(node, ofType);
      case fieldTypes.LIST: {
        const instanceSchema = new schema.Entity(fieldName);

        return new schema.Array(instanceSchema);
      }
      case fieldTypes.OBJECT:
        return new schema.Entity(fieldName);
      default:
        throw `Unknown field kind: ${kind}. Unable to create normalizr schema.`;
    }
  }

  const isScalarNode = node => !isEntityNode(node);
  const isEntityNode = node => !!node.selectionSet;
  const getFieldName = node => node.name.value;
  const getCurrentParent = stack => stack.length > 1 ? stack[stack.length - 1] : stack[0];

  visit(queryAST, visitor);

  return normalize(queryResult, {data: normalizrSchema});
}