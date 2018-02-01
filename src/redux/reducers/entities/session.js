import _ from 'lodash';
import {ADD_SESSION, EDIT_SESSION, DELETE_SESSION, UPDATE_FROM_SERVER} from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const sessionEntities = function(sessionEntities = {}, action) {
  switch(action.type) {
    case ADD_SESSION: {
      return addEntity(sessionEntities, action, 'session');
    }
    case EDIT_SESSION: {
      return editEntity(sessionEntities, action);
    }
    case DELETE_SESSION: {
      return deleteEntity(sessionEntities, action);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities(sessionEntities, action, 'session');
    }
    default:
      return sessionEntities;
  }
};


export default sessionEntities;