import types from '../types';


const addUser = function(user = {}) {
  return {
    type: types.ADD_USER,
    payload: {user},
  };
};

const editUser = function(id, newProps = {}) {
  return {
    type: types.EDIT_USER,
    payload: {id, newProps},
  };
};

const deleteUser = function(id) {
  return {
    type: types.DELETE_USER,
    payload: id,
  };
};


export {
  addUser,
  editUser,
  deleteUser,
};