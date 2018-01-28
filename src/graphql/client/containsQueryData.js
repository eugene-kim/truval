import {visit, BREAK} from 'graphql/language/visitor';
import astReader from './astReader';
import {getReduxEntityName} from './reduxify';


export default (operationAST, schemaDoc, store) => {
  const state = store.getState();
  const stack = [];

  let operationName;
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

        operationName = schemaDoc[operationKey].name;

        if (!operationName) {
          throw `${operationKey} is not a valid operation!`;
        }

        operationSchema = schemaDoc.types.find(type => type.name === operationName);
      },
    },
    Field: {
    	enter(node) {
        const fieldName = astReader.getFieldName(node);

        if (astReader.isEntityNode(node)) {
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
            const operationFieldType = astReader.getOperationFieldType(operationName, fieldName, schemaDoc);
            const entityTypeName = getReduxEntityName(operationFieldType);
            
            // Assume that a query will have an argument named `id` or 
            const id = astReader.getArgument('id', node);

            if (id) {
              const entity = getEntity(id, entityTypeName, state);
              
              if (!entity) {
                existsInStore = false;

                return BREAK;
              }

              stack.push({
                name: entityTypeName,
                ids: [id],
              });
            } else { // Look for an alternative argument containing `Id`, e.g. `userId`.
              const typeIdArgument = astReader.getTypeIdArgument(node);

              if (!typeIdArgument) {
                throw `Root field must contain an argument containing an id or an entity id.`;
              }

              const typeIdName = typeIdArgument.name.value;
              const typeIdValue = typeIdArgument.value.value;
              const typeName = typeIdName.substring(0, typeIdName.length - 2);
              const typeEntity = getEntity(typeIdValue, typeName, state);
              const entityIds = typeEntity[fieldName];

              if (!entityIds) {
                existsInStore = false;

                return BREAK;
              }

              stack.push({
                name: fieldName,
                ids: getArray(entityIds),
              });
            }
          } else { // Child entity field
            const parent = astReader.getCurrentParent(stack);
            const parentEntityName = parent.name;
            const parentEntityIds = parent.ids;
            const {entities} = state;
            
            // Go through parent instances and create an array of ids
            const entityIds = parentEntityIds.reduce((accum, parentEntityId) => {
              const parentEntity = entities[fieldName][parentEntityId];
              const entityIds = parentEntity[fieldName];

              return accum.concat(entityIds);
            }, []);

            // Verify that the store contains all instances of entity ids
            const allEntitiesExist = entityIds.every(entityId => entityExistsInState(fieldName, entityId, state));

            if (!allEntitiesExist) {
              existsInStore = false;

              return BREAK;
            }

            stack.push({
              name: fieldName,
              ids: entityIds,
            });
          }
        } else { // Scalar node - verify that all the entities in the store contain the scalar field.

          // Parent is the entity that contains this scalar field.
          const parent = astReader.getCurrentParent(stack);
          const entityName = parent.name;
          const entityIds = parent.ids;
          const scalarsExists = entityIds.every(entityId => {

            // We know the entity exists by virtue of getting to this block withing the function
            // having previously returned.
            const entity = getEntity(entityId, entityName, state);

            return entity.hasOwnProperty(fieldName);
          });

          if (!scalarsExists) {
            existsInStore = false

            return BREAK;
          }
        }
    	},

      leave(node) {
        stack.pop();
      }
    }
  };

  visit(operationAST, visitor);

  return existsInStore;
};

const entityExistsInState = (entityName, entityId, state) => {
  const {entities} = state;
  const entityType = entities[entityName];
  if (entityType) {
    return false;
  }

  return entityType.hasOwnProperty(entityId);
};

const getArray = (object) => Array.isArray(object) ? object : [object];
const getEntity = (id, entityName, state) => state.entities[entityName].entities[id];