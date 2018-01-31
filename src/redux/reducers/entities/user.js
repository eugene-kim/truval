import _ from 'lodash';
import types from '../../actions/types';
import {addEntity, editEntity, deleteEntity, hydrateEntities} from '../commonReducers';


const reduceUserEntities = function(userEntities = {}, action) {
  const {payload, type} = action;

  switch(type) {
    case types.ADD_USER: {
      return addEntity(userEntities, action, 'user');
    }
    case types.EDIT_USER: {
      return editEntity(userEntities, action);
    }
    case types.DELETE_USER: {
      return deleteEntity(userEntities, action);
    }
    default:
      return hydrateEntities(userEntities, action, 'user');
  }
};


export default reduceUserEntities;