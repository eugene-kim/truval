import _ from 'lodash';
import {ADD_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY, UPDATE_FROM_SERVER} from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const categoryEntities = function(categoryEntities = {}, action) {
  switch(action.type) {
    case ADD_CATEGORY: {
      return addEntity(activityEntities, action, 'category');
    }
    case EDIT_CATEGORY: {
      return editEntity(categoryEntities, action);
    }
    case DELETE_CATEGORY: {
      return deleteEntity(categoryEntities, action);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(activityEntities, action, 'category');
    }
    default:
      return categoryEntities;
  }
};


export default categoryEntities;