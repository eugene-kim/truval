import {getGqlParamString} from 'src/graphql/util';
import {
  ADD_ACTIVITY_TYPE,
  UPDATE_ACTIVITY_TYPE_REQUEST,
  UPDATE_ACTIVITY_TYPE_SUCCESS,
  UPDATE_ACTIVITY_TYPE_FAILURE,
  REMOVE_ACTIVITY_TYPE,
} from '../types';


// We call this 'addActivityType' instead of `createActivityType` since we're either adding an entirely new
// `ActivityType` instance or simply incrementing the count of an existing `ActivityType` instance.
export const addActivityType = (activityType = {}) => ({
  type: ADD_ACTIVITY_TYPE,
  payload: {activityType},
});

export const updateActivityType = ({id, propsToUpdate, client}) => async dispatch => {
  dispatch(updateActivityTypeRequest({id, propsToUpdate}));

  const updateActivityTypeMutation = `
    mutation {
      updateActivityType(${getGqlParamString({id, ...propsToUpdate})})
    }
  `;

  try {
    const response = await client.mutate(updateActivityTypeMutation);

    dispatch(updateActivityTypeSuccess({id, propsToUpdate}));
  } catch (error) {
    const {message} = error;

    dispatch(updateActivityTypeFailure({id, errorMessage: message}));
  }
};

export const updateActivityTypeRequest = ({id, propsToUpdate}) => ({
  type: UPDATE_ACTIVITY_TYPE_REQUEST,
  payload: {id, propsToUpdate},
});

export const updateActivityTypeSuccess = ({id, propsToUpdate}) => ({
  type: UPDATE_ACTIVITY_TYPE_SUCCESS,
  payload: {id, propsToUpdate},
});

const updateActivityTypeFailure = ({id, errorMessage}) => ({
  type: UPDATE_ACTIVITY_TYPE_FAILURE,
  payload: {id, errorMessage},
});

export const removeActivityType = id => ({
  type: REMOVE_ACTIVITY_TYPE,
  payload: {id},
});


export default {
  addActivityType,
  updateActivityType,
  updateActivityTypeRequest,
  updateActivityTypeSuccess,
  updateActivityTypeFailure,
  removeActivityType,
};