import _ from 'lodash';

import {
  createEntity,
  updateEntity,
  deleteEntity,
  hydrateEntities,
} from '../commonReducers/entityReducers';
import {FAILED, LOADING, LOADED, UPDATING, DELETING} from 'fetchStatus';


// TODO: creating and deleting should update related entries as well
const entitiesReducerFactory = entityName => (entities = {}, action) => {
  const entityNameCaps = _.toUpper(entityName);
  const {type, payload} = action;

  switch(type) {
    case `CREATE_${entityNameCaps}_SUCCESS`: {
      return createEntity(action, entityName)(entities);
    }
    case `UPDATE_${entityNameCaps}_SUCCESS`: {
      return updateEntity(action)(entities);
    },
    case `DELETE_${entityNameCaps}_SUCCESS`: {
      return deleteEntity(action)(entities);
    },
    case `UPDATE_FROM_SERVER`: {
      return hydrateEntities(entities, action, entityName);
    },
    default:
      return entities;
  }
};



export default entitiesReducerFactory;