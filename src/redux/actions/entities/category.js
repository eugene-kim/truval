import types from '../types';


const addCategory = (category = {}) => {
  return {
    type: types.ADD_CATEGORY,
    payload: {category},
  };
};

const editCategory = (id, newProps = {}) => {
  return {
    type: types.EDIT_CATEGORY,
    payload: {id, newProps},
  };
};

const deleteCategory = id => {
  return {
    type: types.DELETE_CATEGORY,
    payload: id,
  };
};


export {
  addCategory,
  editCategory,
  deleteCategory,
};