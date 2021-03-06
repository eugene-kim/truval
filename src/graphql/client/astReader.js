import _ from 'lodash';
import invariant from 'invariant';


const astReader = {

  /**
   * -------------------------------------------------------
   * Node Boolean methods
   * -------------------------------------------------------
   */

  isEntityNode(node) {
    return !!node.selectionSet;
  },

  isScalarNode(node) {
    return !this.isEntityNode(node);
  },

  entityContainsId(entityNode) {
    return this.getNodeFields(entityNode).find(field => field.name.value === 'id');
  },

  getIsQueryOperation(operationName) {
    return operationName === 'Query';
  },

  /**
   * -------------------------------------------------------
   * Node Retrieval methods
   * -------------------------------------------------------
   */

  getFieldName(field) {
    return field.name.value;
  },

  getNodeFields(entityNode) {
    return entityNode.selectionSet.selections;
  },

  getCurrentParent(stack) {
    return stack.length > 0 ? stack[stack.length - 1] : undefined;
  },

  getOpRootField(node, opSchema) {
    return opSchema.fields.find(field => field.name === this.getFieldName(node));
  },

  getArgument(argumentName, node) {
    try {
      return node.arguments.find(argument => argument.name.value === argumentName).value.value;
    } catch (error) {
      return null;
    }
  },

  /**
   * Retrieves a node's argument that ends with `Id`, e.g. `userId`.
   */
  getTypeIdArgument(node){
    return node.arguments.find(argument => this.endsWithId(argument.name.value));
  },

  endsWithId(string) {
    const length = string.length;

    if (length < 2) {
      return false;
    }

    const lastTwo = string.substring(string.length - 2, string.length);

    // Our use of camelCase should prevent most if not all false positives that might have
    // come from other word that ended with 'i' and 'd'.
    return lastTwo === 'Id';
  },

  getOperationType(operationName, schemaDoc) {
    return schemaDoc.types.find(schemaType => schemaType.name === operationName);
  },

  getOperationRootFieldType(operationName, fieldName, schemaDoc) {
    const operationType = this.getOperationType(operationName, schemaDoc);
    const operationTypeName = operationType.name;

    invariant(
      operationType,
      `No operation of type ${operationTypeName} found.`,
    );

    const operationFields = operationType.fields;
    const operationField = operationFields.find(operationField => operationField.name === fieldName);

    invariant(
      operationField,
      `No field with name ${fieldName} found under the fields of ${operationTypeName}`,
    );

    return this.getNodeFieldType(operationField.type);
  },

  /**
   * Returns the node's GraphQL type that is defined in your GraphQL schema.
   * e.g. 'User', 'Session'
   */
  // TODO: Expand this method as you come across more types.
  getNodeFieldType({kind, name, ofType}) {
    switch(kind) {
      case GQL_FIELD_TYPES.NON_NULL:
      case GQL_FIELD_TYPES.LIST:
        return this.getNodeFieldType(ofType);
      case GQL_FIELD_TYPES.OBJECT:
        return name;
      default:
        throw new Error(`Unknown field kind: ${kind}. Unable to grab node type name.`);
    }
  },

  /**
   * This method retrieves the GraphQL schema type object of an entity field that's
   * a child of another entity field.
   * 
   * Params:
   * - fieldName: name of the field that the visitor is going across
   * - parentFieldType: the GraphQL schema type string
   * - schemaDoc: the schema document that's been retrieved via the GraphQL introspection query

   Example input:
   ('sessions', 'User', <schemaDoc>) -> {
     "kind": "LIST",
     "name": null,
     "ofType": {
       "kind": "OBJECT",
       "name": "Session",
       "ofType": null
     }
   }
   */
  getChildFieldType(fieldName, parentFieldType, schemaDoc) {
    const parentSchema = this.getNodeSchema(parentFieldType, schemaDoc);
    const childField = parentSchema.fields.find(field => field.name === fieldName);

    return childField.type;
  },

  getNodeSchema(typeName, schemaDoc) {
    return schemaDoc.types.find(schemaType => schemaType.name === typeName);
  },

  /**
   * -------------------------------------------------------
   * AST retrieval methods - no node interaction
   * -------------------------------------------------------
   */

  getOperationName(operationAST) {
    return _.startCase(this.getOperationDefinition(operationAST).operation);
  },

  /**
   * We're supporting one operation type per request.
   */
  getOperationDefinition(operationAST) {
    return operationAST.definitions[0];
  },

  getOperationRootField(operationAST) {
    return this.getOperationRootFields(operationAST)[0];
  },

  getOperationRootFields(operationAST) {
    return this.getOperationDefinition(operationAST).selectionSet.selections;
  },

  getOperationRootFieldName(operationAST) {
    const operationRootField = this.getOperationRootField(operationAST);

    return this.getFieldName(operationRootField);
  },

  getOperationRootFieldNames(operationAST) {
    const operationRootFields = this.getOperationRootFields(operationAST);

    return operationRootFields.map(operationRootField => this.getFieldName(operationRootField));
  },
};

const GQL_FIELD_TYPES = {
  NON_NULL: 'NON_NULL',
  OBJECT: 'OBJECT',
  LIST: 'LIST',
};


export {GQL_FIELD_TYPES};
export default astReader;