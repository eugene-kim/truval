import _ from 'lodash';
import types from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const categoryEntities = function(categoryEntities = {}, action) {
  switch(action.type) {
    case types.ADD_CATEGORY: {
      return addEntity(activityEntities, action, 'category');
    }
    case types.EDIT_CATEGORY: {
      return editEntity(categoryEntities, action);
    }
    case types.DELETE_CATEGORY: {
      return deleteEntity(categoryEntities, action);
    }
    default:
      return hydrateEntities(activityEntities, action, 'category');
  }
};


export default categoryEntities;