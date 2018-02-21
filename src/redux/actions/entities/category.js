import {ADD_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY} from '../types';


const addCategory = (category = {}) => {
  return {
    type: ADD_CATEGORY,
    payload: {category},
  };
};

const editCategory = (id, propsToEdit = {}) => {
  return {
    type: EDIT_CATEGORY,
    payload: {id, propsToEdit},
  };
};

const deleteCategory = id => {
  return {
    type: DELETE_CATEGORY,
    payload: id,
  };
};


export {
  addCategory,
  editCategory,
  deleteCategory,
};