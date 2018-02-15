import {ADD_USER, EDIT_USER, DELETE_USER} from '../types';


export const addUser = (user = {}) => {
  return {
    type: ADD_USER,
    payload: {user},
  };
};

export const editUser = (id, newProps = {}) => {
  return {
    type: EDIT_USER,
    payload: {id, newProps},
  };
};

export const deleteUser = id => {
  return {
    type: DELETE_USER,
    payload: id,
  };
};


export {
  addUser,
  editUser,
  deleteUser,
};