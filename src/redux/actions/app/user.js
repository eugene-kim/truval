import { getGqlParamString } from 'graphql/util';
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
} from './types';


export const createUserRequest = user => ({
  type: CREATE_USER_REQUEST,
  payload: user,
});

const createUserSuccess = user => ({
  type: CREATE_USER_SUCCESS,
  payload: user,
});

const createUserFailure = errorMessage => ({
  type: CREATE_USER_FAILURE,
  payload: {errorMessage},
});

export const createUser = ({username, email, password}, client) => async dispatch => {
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

export const updateUserRequest = (id, propsToUpdate = {}) => ({
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

export const updateUser = ({id, propsToUpdate, client}) => async dispatch => {
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
    const updateUserSuccessAction = updateUserSuccess({id, propsToUpdate});

    dispatch(updateUserSuccessAction);
  } catch (error) {
    const {message} = error;
    const updateUserFailureAction = updateUserFailure({id, errorMessage: message});

    dispatch(updateUserFailureAction);
  }
};

export const deleteUserRequest = id => ({
  type: DELETE_USER_REQUEST,
  payload: {id},
});

const deleteUserSuccess = id => ({
  type: DELETE_USER_SUCCESS,
  payload: {id},
});

const deleteUserFailure = ({id, errorMessage}) => ({
  type: DELETE_USER_FAILURE,
  payload: {id, errorMessage},
});

export const deleteUser = ({id, client}) => async dispatch => {
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
    const deleteUserFailureAction = deleteUserFailure({id, errorMessage: message})

    dispatch(deleteUserFailureAction);
  }
};