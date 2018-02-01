import {ADD_SESSION, EDIT_SESSION, DELETE_SESSION} from '../types';


const addSession = (session = {}) => {
  return {
    type: ADD_SESSION,
    payload: {session},
  };
};

const editSession = (id, newProps = {}) => {
  return {
    type: EDIT_SESSION,
    payload: {id, newProps},
  };
};

const deleteSession = (id) => {
  return {
    type: DELETE_SESSION,
    payload: id,
  };
};


export {
  addSession,
  editSession,
  deleteSession,
};