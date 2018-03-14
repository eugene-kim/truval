import {getGqlParamString} from 'graphql/util';
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


export const createCategory = ({category = {}, client}) => async dispatch => {
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

    dispatch(createCategorySuccess({category: newCategory}));
  } catch(error) {
    const {message} = error;

    dispatch(createCategoryFailure(message));
  }
};

export const createCategoryRequest = category => ({
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

export const updateCategory = ({id, propsToUpdate, client}) => async dispatch => {
  dispatch(updateCategoryRequest({id, propsToUpdate}));

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

    dispatch(updateCategoryFailure({id, errorMessage: message}));
  }
};

export const updateCategoryRequest = ({id, propsToUpdate}) => ({
  type: UPDATE_CATEGORY_REQUEST,
  payload: {id, propsToUpdate},
});

const updateCategorySuccess = ({id, propsToUpdate}) => ({
  type: UPDATE_CATEGORY_SUCCESS,
  payload: {id, propsToUpdate},
});

const updateCategoryFailure = ({id, errorMessage}) => ({
  type: UPDATE_CATEGORY_FAILURE,
  payload: {id, errorMessage},
});

export const deleteCategory = ({id, client}) => async dispatch => {
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

    dispatch(deleteCategoryFailure({id, errorMessage: message}));
  }
};

export const deleteCategoryRequest = id => ({
  type: DELETE_CATEGORY_REQUEST,
  payload: {id},
});

const deleteCategorySuccess = id => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: {id},
});

const deleteCategoryFailure = ({id, errorMessage}) => ({
  type: DELETE_CATEGORY_FAILURE,
  payload: {id, errorMessage},
});


export default {
  createCategory,
  updateCategory,
  deleteCategory,
};