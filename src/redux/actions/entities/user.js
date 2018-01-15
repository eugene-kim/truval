import types from '../types';


const addUser = (user = {}) => {
  return {
    type: types.ADD_USER,
    payload: {user},
  };
};

const editUser = (id, newProps = {}) => {
  return {
    type: types.EDIT_USER,
    payload: {id, newProps},
  };
};

const deleteUser = id => {
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