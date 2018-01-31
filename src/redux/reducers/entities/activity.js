import _ from 'lodash';
import types from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const activityEntities = function(activityEntities = {}, action) {
  switch(action.type) {
    case types.ADD_ACTIVITY: {
      return addEntity(activityEntities, action, 'activity');
    }
    case types.EDIT_ACTIVITY: {
      return editEntity(activityEntities, action);
    }
    case types.DELETE_ACTIVITY: {
      return deleteEntity(activityEntities, action);
    }
    default:
      return hydrateEntities(activityEntities, action, 'activity');
  }
};


export default activityEntities;