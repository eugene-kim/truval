import types from './types';


const addCategory = function(category = {}) {
  return {
    type: types.ADD_CATEGORY,
    payload: {category},
  };
};

const editCategory = function(id, newProps = {}) {
  return {
    type: types.EDIT_CATEGORY,
    payload: {id, newProps},
  };
};

const deleteCategory = function(id) {
  return {
    type: types.DELETE_CATEGORY,
    payload: id,
  };
};


export default {
  addCategory,
  editCategory,
  deleteCategory,
};