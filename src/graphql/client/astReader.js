import _ from 'lodash';


const astReader = {

  isEntityNode(node) {
    return !!node.selectionSet;
  },

  isScalarNode(node) {
    return !this.isEntityNode(node);
  },

  getFieldName(node) {
    return node.name.value;
  },

  entityContainsId(entityNode) {
    return this.getNodeFields(entityNode).find(field => field.name.value === 'id');
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

  getArgument(node, argumentName) {
    try {
      return node.arguments.find(argument => argument.name.value === argumentName).value.value;
    } catch (error) {
      return null;
    }
  },

  /**
   * Retrieves a node's argument that ends with `Id`, e.g. `userId`.
   */
  getEntityIdArgument(node){
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

  /**
   * This method 
   */
  getOperationRootFieldName(operationName, fieldName, schemaDoc) {

    // The root field in a query will result in 
    if (getIsQueryOperation(operationName)) {
      return fieldName;
    }

    // Mutations (and potentially other operations) have root field names that
    // will not match what the GraphQL server returns, e.g. getUser() -> user


  },

  getIsQueryOperation(operationName) {
    return operationName === 'Query';
  },

  getOperationFieldType(operationName, fieldName, schemaDoc) {
    const operation = schemaDoc.types.find(schemaType => schemaType.name === operationName);

    if (!operation) {
      throw `No operation of type ${operationType} found.`;
    }

    const operationFields = operation.fields;
    const operationField = operationFields.find(operationField => operationField.name === fieldName);

    if (!operationField) {
      throw `No field with name ${fieldName} found under the fields of ${operationType}`;
    }

    return this.getNodeFieldType(operationField.type);
  },

  /**
   * Returns the node's GraphQL type.
   */
  // TODO: Expand this method as you come across more types.
  getNodeFieldType({kind, name, ofType}) {
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
  },

  getChildFieldType(parentFieldType, node, schemaDoc) {
    const parentSchema = getNodeSchema(parentFieldType, schemaDoc);
    const childField = parentSchema.fields.find(field => field.name === astReader.getFieldName(node));

    return childField.type;
  },

  getNodeSchema(typeName, schemaDoc) {
    return schemaDoc.types.find(schemaType => schemaType.name === typeName);
  }
};


export default astReader;