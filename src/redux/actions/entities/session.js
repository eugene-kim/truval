import {ADD_SESSION, EDIT_SESSION, DELETE_SESSION} from '../types';


export const addSession = (session = {}) => {
  return {
    type: ADD_SESSION,
    payload: {session},
  };
};

export const editSession = (id, propsToEdit = {}) => {
  return {
    type: EDIT_SESSION,
    payload: {id, propsToEdit},
  };
};

export const deleteSession = (id) => {
  return {
    type: DELETE_SESSION,
    payload: id,
  };
};


export default {
  addSession,
  editSession,
  deleteSession,
};