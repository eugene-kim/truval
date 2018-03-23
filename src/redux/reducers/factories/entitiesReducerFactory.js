import _ from 'src/libs/dash';

import {
  createEntity,
  updateEntity,
  deleteEntity,
  hydrateEntities,
} from '../commonReducers/entityReducers';
import {UPDATE_FROM_SERVER} from 'src/redux/actions/types';


// TODO: creating and deleting should update related entries as well
const entitiesReducerFactory = ({entityType, entities, action}) => {
  const entityTypeCaps = _.toSnakeUpper(entityType);
  const {type, payload} = action;

  switch(type) {
    case `CREATE_${entityTypeCaps}_SUCCESS`: {
      return createEntity(action, entityType)(entities);
    }
    case `UPDATE_${entityTypeCaps}_SUCCESS`: {
      return updateEntity(action)(entities);
    }
    case `DELETE_${entityTypeCaps}_SUCCESS`: {
      return deleteEntity(action)(entities);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities({entities, action, entityType});
    }
    default:
      return entities;
  }
};



export default entitiesReducerFactory;