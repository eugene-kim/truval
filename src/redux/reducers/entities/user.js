import _ from 'lodash';
import {ADD_USER, EDIT_USER, DELETE_USER, UPDATE_FROM_SERVER} from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const reduceUserEntities = function(userEntities = {}, action) {
  switch(action.type) {
    case ADD_USER: {
      return addEntity(userEntities, action, 'user');
    }
    case EDIT_USER: {
      return editEntity(userEntities, action);
    }
    case DELETE_USER: {
      return deleteEntity(userEntities, action);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(userEntities, action, 'user');
    }
    default:
      return userEntities;
  }
};


export default reduceUserEntities;