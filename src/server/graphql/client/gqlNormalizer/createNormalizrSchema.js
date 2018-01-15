const {schema} = require('normalizr');
const {visit} = require('graphql/language/visitor');
const _ = require('lodash');

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
        if (isScalarNode(node)) {
          return false;
        }

        if (!entityContainsId(node)) {
          throw `Every non scalar field must include the id field in order for normalizr to work properly.`;
        }

        const fieldName = getFieldName(node);

        // An operation root field is a field that directly follows an operation name (query, mutation, subscription).
        const operationRootField = getOpRootField(node, operationSchema);
        const parent = getCurrentParent(stack);

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
          const operationFieldType = getOperationFieldType(operationName, fieldName, schemaDoc);
          const operationFieldTypeLower = _.toLower(operationFieldType);

          const nodeNormalizrSchema = createNormalizrSchema(operationFieldTypeLower, operationRootField.type);
          const fieldType = getNodeFieldType(operationRootField.type);

          Object.assign(normalizrSchema, {[operationFieldTypeLower]: nodeNormalizrSchema});
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
          const fieldTypeObject = getChildFieldType(parentFieldType, node, schemaDoc);
          const fieldTypeName = getNodeFieldType(fieldTypeObject);
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

const getOperationFieldType = (operationName, fieldName, schemaDoc) => {
  const operation = schemaDoc.types.find(schemaType => schemaType.name === operationName);

  if (!operation) {
    throw `No operation of type ${operationType} found.`;
  }

  const operationFields = operation.fields;
  const operationField = operationFields.find(operationField => operationField.name === fieldName);

  if (!operationField) {
    throw `No field with name ${fieldName} found under the fields of ${operationType}`;
  }

  return getNodeFieldType(operationField.type);
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

const getChildFieldType = (parentFieldType, node, schemaDoc) => {
  const parentSchema = getNodeSchema(parentFieldType, schemaDoc);
  const childField = parentSchema.fields.find(field => field.name === getFieldName(node));

  return childField.type;
}

const getNodeSchema = (typeName, schemaDoc) =>
  schemaDoc.types.find(schemaType => schemaType.name === typeName);

const getOpRootField = (node, opSchema) =>
  opSchema.fields.find(field => field.name === getFieldName(node));

// TODO: Expand this method as you come across more types.
const getNodeFieldType = ({kind, name, ofType}) => {
  switch(kind) {
    case GQL_FIELD_TYPES.NON_NULL:
      return getNodeFieldType(ofType);
    case GQL_FIELD_TYPES.LIST:
      return ofType.name;
    case GQL_FIELD_TYPES.OBJECT:
      return name;
    default:
      throw `Unknown field kind: ${kind}. Unable to grab node type name.`;
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

const entityContainsId = entityNode => getNodeFields(entityNode).find(field => field.name.value === 'id');
const getNodeFields = entityNode => entityNode.selectionSet.selections;
const isScalarNode = node => !isEntityNode(node);
const isEntityNode = node => !!node.selectionSet;
const getFieldName = node => node.name.value;
const getCurrentParent = stack => stack.length > 0 ? stack[stack.length - 1] : undefined;