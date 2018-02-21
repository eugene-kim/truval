import _ from 'lodash';
import {ADD_ACTIVITY_INSTANCE, EDIT_ACTIVITY_INSTANCE, DELETE_ACTIVITY_INSTANCE, UPDATE_FROM_SERVER} from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const activityInstanceEntities = function(activityInstanceEntities = {}, action) {
  switch(action.type) {
    case ADD_ACTIVITY_INSTANCE: {
      return addEntity(activityInstanceEntities, action, 'activityInstance');
    }
    case EDIT_ACTIVITY_INSTANCE: {
      return editEntity(activityInstanceEntities, action);
    }
    case DELETE_ACTIVITY_INSTANCE: {
      return deleteEntity(activityInstanceEntities, action);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(activityInstanceEntities, action, 'activityInstance');
    }
    default:
      return activityInstanceEntities;
  }
};


export default activityInstanceEntities;