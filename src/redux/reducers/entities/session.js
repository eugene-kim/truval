import _ from 'lodash';
import types from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const sessionEntities = function(sessionEntities = {}, action) {
  switch(action.type) {
    case types.ADD_SESSION: {
      return addEntity(sessionEntities, action, 'session');
    }
    case types.EDIT_SESSION: {
      return editEntity(sessionEntities, action);
    }
    case types.DELETE_SESSION: {
      return deleteEntity(sessionEntities, action);
    }
    default:
      return hydrateEntities(sessionEntities, action, 'session');
  }
};


export default sessionEntities;