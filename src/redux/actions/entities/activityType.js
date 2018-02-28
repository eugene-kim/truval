import getGqlParamString from 'graphql/util';
import {
  ADD_ACTIVITY_TYPE,
  UPDATE_ACTIVITY_TYPE_REQUEST,
  UPDATE_ACTIVITY_TYPE_SUCCESS,
  UPDATE_ACTIVITY_TYPE_FAILURE,
  DELETE_ACTIVITY_TYPE,
} from '../types';


// We call this 'addActivityType' instead of `createActivityType` since we're either adding an entirely new
// `ActivityType` instance or simply incrementing the count of an existing `ActivityType` instance.
export const addActivityType = (activityType = {}) => {
  return {
    type: ADD_ACTIVITY_TYPE,
    payload: {activityType},
  };
};

export const updateActivityType = async (id, propsToUpdate, client) => dispatch => {
  dispatch(updateActivityTypeRequest({id, propsToUpdate}));

  const updateActivityTypeMutation = `
    mutation {
      updateActivityType(${getGqlParamString({id, ...propsToUpdate})})
    }
  `;

  try {
    const response = await client.mutate(updateActivityTypeMutation);

    dispatch(updateActivityTypeSuccess(id, propsToUpdate));
  } catch (error) {
    const {message} = error;

    dispatch(updateActivityTypeFailure(message));
  }
};

const updateActivityTypeRequest = (id, propsToUpdate) => ({
  type: UPDATE_ACTIVITY_TYPE_REQUEST,
  payload: {id, propsToUpdate},
});

const updateActivityTypeSuccess = (id, propsToUpdate) => ({
  type: UPDATE_ACTIVITY_TYPE_SUCCESS,
  payload: {id, propsToUpdate},
});

const updateActivityTypeFailure = errorMessage => ({
  type: UPDATE_ACTIVITY_TYPE_FAILURE,
  payload: {errorMessage},
});

export const removeActivityType = id => {
  return {
    type: DELETE_ACTIVITY_TYPE,
    payload: id,
  };
};


export default {
  addActivityType,
  updateActivityType,
  removeActivityType,
};