import {getGqlParamString} from 'src/graphql/util';
import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  UPDATE_SESSION_REQUEST,
  UPDATE_SESSION_SUCCESS,
  UPDATE_SESSION_FAILURE,
  DELETE_SESSION_REQUEST,
  DELETE_SESSION_SUCCESS,
  DELETE_SESSION_FAILURE,
} from '../types';


export const createSession = ({session = {}, client}) => async dispatch => {
  dispatch(createSessionRequest(session));

  const createSessionMutation = `
    mutation {
      createSession(${getGqlParamString(session)}) {
        id, name, start, end, isComplete
      }
    }
  `;

  try {
    const response = await client.mutate(createSessionMutation);
    const newSession = response.data.createSession;
    const {id, name, start, end, isComplete} = newSession;

    dispatch(createSessionSuccess({session: newSession}));
  } catch(error) {
    const {message} = error;

    dispatch(createSessionFailure(message));
  }
};

export const createSessionRequest = session => ({
  type: CREATE_SESSION_REQUEST,
  payload: {session},
});

const createSessionSuccess = session => ({
  type: CREATE_SESSION_SUCCESS,
  payload: {session},
});

const createSessionFailure = errorMessage => ({
  type: CREATE_SESSION_FAILURE,
  payload: {errorMessage},
});

export const updateSession = ({id, propsToUpdate, client}) => async dispatch => {
  dispatch(updateSessionRequest({id, propsToUpdate}));

  const updateSessionMutation = `
    mutation {
      updateSession(${getGqlParamString({id, ...propsToUpdate})}) {
        id, name, start, end, isComplete
      }
    }
  `;

  try {
    const response = await client.mutate(updateSessionMutation);

    dispatch(updateSessionSuccess({id, propsToUpdate}));
  } catch(error) {
    const errorMessage = error.message;

    dispatch(updateSessionFailure({id, errorMessage}));
  }
};

export const updateSessionRequest = ({id, propsToUpdate}) => ({
  type: UPDATE_SESSION_REQUEST,
  payload: {id, propsToUpdate},
});

const updateSessionSuccess = ({id, propsToUpdate}) => ({
  type: UPDATE_SESSION_SUCCESS,
  payload: {id, propsToUpdate},
});

const updateSessionFailure = ({id, errorMessage}) => ({
  type: UPDATE_SESSION_FAILURE,
  payload: {id, errorMessage},
});

export const deleteSession = ({id, client}) => async dispatch => {
  dispatch(deleteSessionRequest(id));

  const deleteSessionMutation = `
    mutate {
      deleteSession(${getGqlParamString({id})})
    }
  `;

  try {
    await client.mutate(deleteSessionMutation);

    dispatch(deleteSessionSuccess(id));
  } catch (error) {
    const errorMessage = error.message;

    dispatch(deleteSessionFailure({id, errorMessage}));
  }
};

export const deleteSessionRequest = id => ({
  type: DELETE_SESSION_REQUEST,
  payload: {id},
});

const deleteSessionSuccess = id => ({
  type: DELETE_SESSION_SUCCESS,
  payload: {id},
});

const deleteSessionFailure = ({id, errorMessage}) => ({
  type: DELETE_SESSION_FAILURE,
  payload: {id, errorMessage},
});