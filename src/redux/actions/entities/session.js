import types from '../types';


const addSession = (session = {}) => {
  return {
    type: types.ADD_SESSION,
    payload: {session},
  };
};

const editSession = (id, newProps = {}) => {
  return {
    type: types.EDIT_SESSION,
    payload: {id, newProps},
  };
};

const deleteSession = (id) => {
  return {
    type: types.DELETE_SESSION,
    payload: id,
  };
};


export {
  addSession,
  editSession,
  deleteSession,
};