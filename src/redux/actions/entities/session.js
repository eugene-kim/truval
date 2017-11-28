import types from './types';


const addSession = function(session = {}) {
  return {
    type: types.ADD_SESSION,
    payload: {session},
  };
};

const editSession = function(id, newProps = {}) {
  return {
    type: types.EDIT_SESSION,
    payload: {id, newProps},
  };
};

const deleteSession = function(id) {
  return {
    type: types.DELETE_SESSION,
    payload: id,
  };
};


export default {
  addSession,
  editSession,
  deleteSession,
};