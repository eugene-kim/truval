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

    // Our use of camelcase should prevent most if not all false positives that might have
    // come from other word that ended with 'i' and 'd'.
    return lastTwo === 'Id';
  },
};


export default astReader;