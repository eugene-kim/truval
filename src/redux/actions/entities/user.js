import getGqlParamString from 'graphql/util';
import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
} from '../types';


const createUserRequest = ({username, email, password}) => ({
  type: CREATE_USER_REQUEST,
  payload: {username, email, password},
});

const createUserSuccess = ({id, username, email, password}) => ({
  type: CREATE_USER_SUCCESS,
  payload: {id, username, email, password},
});

const createUserFailure = errorMessage => ({
  type: CREATE_USER_FAILURE,
  payload: {errorMessage},
});

export const createUser = async ({username, email, password}, client) => async dispatch => {
  dispatch(createUserRequest({username, email, password}));

  const createUserMutation = `
    mutation {
      createUser(${getGqlParamString({username, email, password})}) {
        id, username, email
      }
    }
  `;

  try {
    const response = await client.mutate(createUserMutation);
    const user = response.data.createUser;
    const {id} = user;

    dispatch(createUserSuccess({id, username, email, password}));
  } catch (error) {
    const {message} = error;

    dispatch(createUserFailure(message));
  }
};

const updateUserRequest = (id, propsToUpdate = {}) => ({
  type: UPDATE_USER_REQUEST,
  payload: {id, propsToUpdate},
});

const updateUserSuccess = (id, propsToUpdate = {}) => ({
  type: UPDATE_USER_REQUEST,
  payload: {id, propsToUpdate},
});

const updateUserFailure = errorMessage => ({
  type: UPDATE_USER_REQUEST,
  payload: {errorMessage},
});

export const updateUser = async (id, propsToUpdate, client) => dispatch => {
  dispatch(updateUserRequest(id, propsToUpdate));

  try {
    const updateUserMutation = `
      mutation {
        updateUser(${getGqlParamString({id, ...propsToUpdate}))}) {
          id, username, email
        }
      }
    `;
    const response = await client.mutate(updateUserMutation);
    const user = response.data.updateUser;

    dispatch(updateUserSuccess(id, propsToUpdate));
  } catch (error) {
    const {message} = error;

    dispatch(updateUserFailure(message));
  }
};

const deleteUserRequest = id => ({
  type: DELETE_USER_REQUEST,
  payload: {id},
});

const deleteUserSuccess = id => ({
  type: DELETE_USER_SUCCESS,
  payload: {id},
});

const deleteUserFailure = errorMessage => ({
  type: DELETE_USER_FAILURE,
  payload: {errorMessage},
});

export const deleteUser = async (id, client) => dispatch => {
  dispatch(deleteUserRequest(id));

  try {
    const deleteUserMutation = `
      mutation {
        deleteUser(${getGqlParamString({id})})
      }
    `;

    await client.mutate(deleteUserMutation);

    dispatch(deleteUserSuccess(id));
  } catch (error) {
    const {message} = error;

    dispatch(deleteUserFailure(message));
  }
};


export default {
  createUser,
  updateUser,
  deleteUser,
};