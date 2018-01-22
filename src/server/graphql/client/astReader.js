module.exports = {
  isEntityNode: node => !!node.selectionSet,
  isScalarNode: node => !isEntityNode(node),
  getFieldName: node => node.name.value,
  entityContainsId: entityNode => getNodeFields(entityNode).find(field => field.name.value === 'id'),
  getCurrentParent: stack => stack.length > 0 ? stack[stack.length - 1] : undefined,
  getOpRootField: (node, opSchema) => {
    return opSchema.fields.find(field => field.name === astReader.getFieldName(node));
  },
  getArgument: (node, argumentName) => {
    try {
      return node.arguments.find(argument => argument.name.value === argumentName).value.value;
    } catch (error) {
      return null;
    }
  },

  /**
   * Retrieves the `id` argument of a node. The id argument will be named:
   * (1) `id` or
   * (2) <typeName>Id
   * If both exist, `id` gets preference.
   */
  getIdArgument: node => {
    try {
      node.arguments.filter(argument => )

    }
  }
};