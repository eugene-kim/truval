const {visit} = require('graphql/language/visitor');
const pluralize = require('pluralize');
const astReader = require('./astReader');


module.exports = (gqlOperationAST, schemaDoc, state) => {
  const stack = [];
  let operationSchema;
  let existsInStore = true;

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
          throw `${operationKey} is not a valid operation!`;
        }

        operationSchema = schemaDoc.types.find(type => type.name === operationName);
      },
    },
    Field: {
    	enter(node) {
        if (isEntityNode(node)) {
          if (!astReader.entityContainsId(node)) {
            throw `Every non scalar field must include the id field in order for normalizr to work properly.`;
          }

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
            // The operation name isn't guaranteed to be the same name as the type that it retrieves,
            // e.g. the operationRootField for a mutation might be `updateUser` and we're really
            // interested in what type this retrieves, which is `User`.
            const operationFieldType = getOperationFieldType(operationName, fieldName, schemaDoc);
            const entityName = getReduxEntityName(operationFieldType);
            
            // Assume that a query will have an argument named `id` or 
            const id = astReader.getArgument(node, id);

            if (id) {
              const entity = getEntity(id, entityName, state);
              
              if (!entity) {
                existsInStore = false;

                return visitor.BREAK;
              }

              stack.push({
                name: entityName,
                ids: [id],
              });
            } else { // 
              const entityIdArgument = astReader.getEntityIdArgument(node);

              if (!entityIdArgument) {
                throw `Root field must contain an argument containing an id or an entity id.`;
              }

              const entityIdArgumentName = entityIdArgument.name.value;
              const entityIdArgumentValue = entityIdArgument.value.value;


            }

          } else {

          }
        } else { // Scalar node

        }
    	},

      leave(node) {
        stack.pop();
      }
    }
  };
};

/**
 * Formats a String to be lowercase and singular.
 * 
 * This is useful when accessing our redux store since a GraphQL type can be represented in multiple ways
 * (e.g. get a single session with `session` or get all of a user's sessions via `sessions`) while
 * an entity in our Redux store will exist in a single location.
 */
const getReduxEntityName = name => pluralize.singular(_.toLower(name));

const getEntity = (id, entityName, state) => state.entities[entityName][id];
}