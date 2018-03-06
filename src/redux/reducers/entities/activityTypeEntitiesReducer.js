import {
  addEntity,
  updateEntity,
  deleteEntity,
  hydrateEntities,
} from '../commonReducers/entityReducers';

import {
  ADD_ACTIVITY_TYPE,
  UPDATE_ACTIVITY_TYPE_SUCCESS,
  DELETE_ACTIVITY_TYPE,
  UPDATE_FROM_SERVER,
} from 'redux/actions/types';


const activityTypeEntitiesReducer = (activityTypeEntities, action) => {
  const {type} = action;

  switch(type) {
    case ADD_ACTIVITY_TYPE: {
      return addEntity(action, 'activityType')(activityTypeEntities);
    }
    case UPDATE_ACTIVITY_TYPE_SUCCESS: {
      return updateEntity(action)(activityTypeEntities);
    }
    case DELETE_ACTIVITY_TYPE: {
      return deleteEntity(action)(activityTypeEntities);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(entities, action, 'activityType');
    }
    default:
      return activityTypeEntities;
  }
}


export default activityTypeEntitiesReducer;