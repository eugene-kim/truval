import {ADD_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY} from '../types';


export const addCategory = (category = {}) => {
  return {
    type: ADD_CATEGORY,
    payload: {category},
  };
};

export const editCategory = (id, propsToEdit = {}) => {
  return {
    type: EDIT_CATEGORY,
    payload: {id, propsToEdit},
  };
};

export const deleteCategory = id => {
  return {
    type: DELETE_CATEGORY,
    payload: id,
  };
};


export default {
  addCategory,
  editCategory,
  deleteCategory,
};