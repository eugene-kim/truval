import getGqlParamString from 'graphql/util';
import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
} from '../types';


export const createCategory = async (category = {}, client) => dispatch => {
  dispatch(createCategoryRequest(category));

  const createCategoryMutation = `
    mutation {
      createCategory(${getGqlParamString(category)}) {
        id, name, color, isPrimary
      }
    }
  `;

  try {
    const response = await client.mutate(createCategoryMutation);
    const newCategory = response.data.createCategory;
    const {id, name, color, isPrimary} = newCategory;

    dispatch(createCategorySuccess({id, name, color, isPrimary}));
  } catch(error) {
    const {message} = error;

    dispatch(createCategoryFailure(message));
  }
};

const createCategoryRequest = category => ({
  type: CREATE_CATEGORY_REQUEST,
  payload: category,
});

const createCategorySuccess = category => ({
  type: CREATE_CATEGORY_SUCCESS,
  payload: category,
});

const createCategoryFailure = errorMessage => ({
  type: CREATE_CATEGORY_FAILURE,
  payload: {errorMessage},
});

export const updateCategory = async (id, propsToUpdate, client) => dispatch => {
  dispatch(updateCategoryRequest(id, propsToUpdate));

  const updateCategoryMutation = `
    mutation {
      updateCategory(${getGqlParamString({id, ...propsToUpdate})}) {
        id, name, color, isPrimary
      }
    }
  `;

  try {
    const response = await client.mutate(updateCategoryMutation);

    dispatch(updateCategorySuccess({id, propsToUpdate}));
  } catch(error) {
    const {message} = error;

    dispatch(updateCategoryFailure(message));
  }
};

const updateCategoryRequest = (id, propsToUpdate) => ({
  type: UPDATE_CATEGORY_REQUEST,
  payload: {id, propsToUpdate},
});

const updateCategorySuccess = (id, propsToUpdate) => ({
  type: UPDATE_CATEGORY_SUCCESS,
  payload: {id, propsToUpdate},
});

const updateCategoryFailure = errorMessage => ({
  type: UPDATE_CATEGORY_FAILURE,
  payload: {errorMessage},
});

export const deleteCategory = async (id, client) => dispatch => {
  dispatch(deleteCategoryRequest(id));

  const deleteCategoryMutation = `
    mutate {
      deleteCategory(${getGqlParamString({id})})
    }
  `;

  try {
    await client.mutate(deleteCategoryMutation);

    dispatch(deleteCategorySuccess(id));
  } catch (error) {
    const {message} = error;

    dispatch(deleteCategoryFailure(message));
  }
};

const deleteCategoryRequest = id => ({
  type: DELETE_CATEGORY_REQUEST,
  payload: {id},
});

const deleteCategorySuccess = id => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: {id},
});

const deleteCategoryFailure = errorMessage => ({
  type: DELETE_CATEGORY_FAILURE,
  payload: {errorMessage},
});


export default {
  createCategory,
  updateCategory,
  deleteCategory,
};