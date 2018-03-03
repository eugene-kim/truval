import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
} from '../../actions/types';

import {
  UPDATING,
  LOADING,
  LOADED,
  FAILED,
  DELETING,
} from '../fetchStatus';


const userFetchStatus = (userFetchStatus = '', action) => {
  const {type, payload} = action;

  switch(type) {
    case CREATE_USER_REQUEST: {
      return LOADING;
    }
    case CREATE_USER_SUCCESS: {
      return LOADED;
    }
    case CREATE_USER_FAILURE: {
      return FAILED;
    }
    case UPDATE_USER_REQUEST: {
      return UPDATING;
    }
    case UPDATE_USER_SUCCESS: {
      return LOADED;
    }
    case UPDATE_USER_FAILURE: {
      return FAILED;
    }
    case DELETE_USER_REQUEST: {
      return DELETING;
    }
    case DELETE_USER_SUCCESS: {
      return '';
    }
    case DELETE_USER_FAILURE: {
      return FAILED;
    }
    default:
      return userFetchStatus;
  }
};


export default userFetchStatus;