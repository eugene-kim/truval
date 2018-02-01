import _ from 'lodash';
import {ADD_ACTIVITY, EDIT_ACTIVITY, DELETE_ACTIVITY, UPDATE_FROM_SERVER} from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const activityEntities = function(activityEntities = {}, action) {
  switch(action.type) {
    case ADD_ACTIVITY: {
      return addEntity(activityEntities, action, 'activity');
    }
    case EDIT_ACTIVITY: {
      return editEntity(activityEntities, action);
    }
    case DELETE_ACTIVITY: {
      return deleteEntity(activityEntities, action);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(activityEntities, action, 'activity');
    }
    default:
      return activityEntities;
  }
};


export default activityEntities;