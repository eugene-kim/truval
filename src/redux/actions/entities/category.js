import {ADD_CATEGORY, EDIT_CATEGORY, DELETE_CATEGORY} from '../types';


const addCategory = (category = {}) => {
  return {
    type: ADD_CATEGORY,
    payload: {category},
  };
};

const editCategory = (id, newProps = {}) => {
  return {
    type: EDIT_CATEGORY,
    payload: {id, newProps},
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