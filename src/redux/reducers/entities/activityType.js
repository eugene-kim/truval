import _ from 'lodash';
import invariant from 'invariant';

import {
  ADD_ACTIVITY_TYPE,
  EDIT_ACTIVITY_TYPE,
  DELETE_ACTIVITY_TYPE,
  UPDATE_FROM_SERVER,

  DELETE_ACTIVITY_INSTANCE
} from '../../actions/types';


import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const activityTypeEntities = function(activityTypeEntities = {}, action) {
  switch(action.type) {
    case ADD_ACTIVITY_TYPE: {
      return addEntity(activityTypeEntities, action, 'activityType');
    }
    case EDIT_ACTIVITY_TYPE: {
      return editEntity(activityTypeEntities, action);
    }
    case DELETE_ACTIVITY_TYPE: {
      return deleteEntity(activityTypeEntities, action);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(activityTypeEntities, action, 'activityType');
    }
    case DELETE_ACTIVITY_INSTANCE: {
      const {payload} = action;
      const {id, activityTypeId} = payload;

      invariant(
        id || activityTypeId,
        `id and activityTypeId are required properties on ${action.type}'s payload.`,
      );

      const activityType = activityTypeEntities.entities[activityTypeId];
      const {activityCount} = activitiyType;
      const updatedCount = activityCount - 1;
      const editActivityTypeAction = editActivityType(id, {activityCount: updatedCount});

      return editEntity(activityTypeEntities, editActivityTypeAction);
    }
    default:
      return activityTypeEntities;
  }
};


export default activityTypeEntities;