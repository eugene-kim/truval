import {schema} from 'normalizr';
import {visit} from 'graphql/language/visitor';
import astReader from './astReader';
import _ from 'lodash';

const GQL_FIELD_TYPES = {
  NON_NULL: 'NON_NULL',
  OBJECT: 'OBJECT',
  LIST: 'LIST',
};

const NORMALIZR_SCHEMA_TYPES = {
  ARRAY: 'ArraySchema',
  VALUES: 'ValuesSchema',
  UNION: 'UnionSchema',
  OBJECT: 'ObjectSchema',
  ENTITY: 'EntitySchema',
};


module.exports = (operationAST, schemaDoc) => {
  const normalizrSchema = {};
  const stack = [];
  let operationSchema;
  let operationName;

  /**
   * A visitor is an object that's passed into GraphQL's visit function. The visitor contains methods
   * that are run as nodes in the abstract syntax tree are traversed. We'll take advantage of visit()
   * that GraphQL provides by creating a normalizr schema that will eventually mirror the structure of
   * operation in the abstract syntax tree as we traverse over the nodes.
   * 
   * More information on visit() and how to create a visitor can be found here:
   * https://github.com/graphql/graphql-js/blob/master/src/language/visitor.js
   */
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
        
        operationName = schemaDoc[operationKey].name;

        if (!operationName) {
          throw `${operationKey} is not a valid operation!`;
        }

        operationSchema = schemaDoc.types.find(type => type.name === operationName);
      },
    },
    Field: {
      enter(node) {
        // Skip over scalar fields - normalizr automatically adds those properties in.
        if (astReader.isScalarNode(node)) {
          return false;
        }

        if (!astReader.entityContainsId(node)) {
          throw `Every non scalar field must include the id field in order for normalizr to work properly.`;
        }

        const fieldName = astReader.getFieldName(node);

        // An operation root field is a field that directly follows an operation name (query, mutation, subscription).
        const operationRootField = astReader.getOpRootField(node, operationSchema);
        const parent = astReader.getCurrentParent(stack);

        // An operation root field:
        // (1) will match one of field names on the operation type in the schema and
        // (2) has no parents on the stack (it's the first field you come across when parsing a query).
        // 
        // A field that matches one of the root fields on the operation type but has
        // a parent is an operation child field with simply the same name as an operation root field.
        const isOperationRootField = operationRootField && !parent;

        if (isOperationRootField) {
          // The operation name isn't guaranteed to be the same name as the type that it retrieves.
          // We'll use the field type to create our normalizr schema.
          const operationFieldType = ast.getOperationFieldType(operationName, fieldName, schemaDoc);
          const formattedOpFieldType = _.toLower(operationFieldType);

          const nodeNormalizrSchema = createNormalizrSchema(formattedOpFieldType, operationRootField.type);
          const fieldType = astReader.getNodeFieldType(operationRootField.type);

          Object.assign(normalizrSchema, {[formattedOpFieldType]: nodeNormalizrSchema});
          console.log(`Adding ${fieldType} to the stack`);
          stack.push({fieldType, nodeNormalizrSchema})
          console.log('Stack\n', stack);
        } else { /* This is a descendant field on an operation. */
          
          // Grab the parent from the stack so we can grab the current gql node type and
          // assign this node's normalizr schema to the parent's normalizr schema.
          const parentNormalizrSchema = parent.nodeNormalizrSchema;
          const parentFieldType = parent.fieldType;
          const parentSingleSchema = getNonPolymorphicSchema(parentNormalizrSchema);
          const parentNormalizrSchemaDefinition = parentSingleSchema.schema;

          // Create normalizr schema for current node.
          const fieldTypeObject = astReader.getChildFieldType(parentFieldType, node, schemaDoc);
          const fieldTypeName = astReader.getNodeFieldType(fieldTypeObject);
          const nodeNormalizrSchema = createNormalizrSchema(fieldName, fieldTypeObject);

          Object.assign(parentNormalizrSchemaDefinition, {[fieldName]: nodeNormalizrSchema});
          parentSingleSchema.define(parentNormalizrSchemaDefinition);
          console.log(`Adding ${fieldTypeName} to the stack`);
          stack.push({fieldType: fieldTypeName, nodeNormalizrSchema});
          console.log('Stack\n', stack);
        }
      },

      leave() {
        const stackEntry = stack.pop();
        console.log(`Popping ${stackEntry.fieldType} from the stack.`);
      },
    },
  };

  visit(operationAST, visitor);

  // The GraphQL responses always contain the `data` root property.
  return {data: normalizrSchema};
}

/**
 * This returns the single schema definition if the passed in normalizr schema
 * is a polymorphic one. If the normalizr schema is already a non polymorphic schema,
 * it's simply returned.
 */
const getNonPolymorphicSchema = normalizrSchema => {
  const normalizrSchemaType = normalizrSchema.constructor.name;

  switch(normalizrSchemaType) {
    case NORMALIZR_SCHEMA_TYPES.OBJECT:
    case NORMALIZR_SCHEMA_TYPES.ENTITY:
      return normalizrSchema;
    case NORMALIZR_SCHEMA_TYPES.ARRAY:
    case NORMALIZR_SCHEMA_TYPES.VALUES:
    case NORMALIZR_SCHEMA_TYPES.UNION:
      return normalizrSchema.schema;
    default:
      throw `Unknown normalizr schema type: ${normalizrSchemaType}.`;
  }
}

const createNormalizrSchema = (fieldName, {kind, name, ofType}) => {
  switch(kind) {
    case GQL_FIELD_TYPES.NON_NULL:
      return createNormalizrSchema(fieldName, ofType);
    case GQL_FIELD_TYPES.LIST: {
      const instanceSchema = new schema.Entity(fieldName);

      return new schema.Array(instanceSchema);
    }
    case GQL_FIELD_TYPES.OBJECT:
      return new schema.Entity(fieldName);
    default:
      throw `Unknown field kind: ${kind}. Unable to create normalizr schema.`;
  }
}