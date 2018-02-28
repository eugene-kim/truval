import getGqlParamString from 'graphql/util';
import {
  CREATE_ACTIVITY_INSTANCE_REQUEST,
  CREATE_ACTIVITY_INSTANCE_SUCCESS,
  CREATE_ACTIVITY_INSTANCE_FAILURE,
  UPDATE_ACTIVITY_INSTANCE_REQUEST,
  UPDATE_ACTIVITY_INSTANCE_SUCCESS,
  UPDATE_ACTIVITY_INSTANCE_FAILURE,
  DELETE_ACTIVITY_INSTANCE_REQUEST,
  DELETE_ACTIVITY_INSTANCE_SUCCESS,
  DELETE_ACTIVITY_INSTANCE_FAILURE,
} from '../types';


export const createActivityInstance = async (activity = {}, client) => dispatch => {
  dispatch(createActivityInstanceRequest(activity));

  const createActivityInstanceMutation = `
    mutation {
      createActivityInstance(${getGqlParamString(activity)}) {
        id, isComplete, start, end
        activityType {
          id, name, activityCount, categoryId,
        } 
      }
    }
  `;

  try {
    const response = await client.mutate(
      createActivityInstanceMutation, {
        shouldNormalizeData: true,
      },
    );

    // TODO: Put this in its own method.
    const activityInstanceEntities = response.entities.activityInstance;
    const activityInstanceId = Object.keys(activityInstanceEntities)[0];
    const activityInstance = activityInstanceEntities[activityInstanceId];

    const activityTypeEntities = response.entities.activityType;
    const activityTypeId = Object.keys(activityTypeEntities)[0];
    const activityType = activityTypeEntities[activityTypeId];

    // Dispatch some add / update activityTask.
    
    dispatch(createActivityInstanceSuccess(activityInstance);
  } catch (error) {
    const {message} = error;

    dispatch(createActivityInstanceFailure(message));
  }
};

const createActivityInstanceRequest = (activity = {}) => ({
  type: ADD_ACTIVITY_INSTANCE_REQUEST,
  payload: {activity},
});

const createActivityInstanceSuccess = (activity = {}) => {
  return {
    type: ADD_ACTIVITY_INSTANCE_SUCCESS,
    payload: {activity},
  };
};

const createActivityInstanceFailure = errorMessage => {
  return {
    type: ADD_ACTIVITY_INSTANCE_FAILURE,
    payload: {errorMessage},
  };
};

export const editActivityInstance = (id, propsToEdit = {}) => {
  return {
    type: EDIT_ACTIVITY_INSTANCE,
    payload: {id, propsToEdit},
  };
};

export const deleteActivityInstance = ({id, activityTypeId}) => {
  return {
    type: DELETE_ACTIVITY_INSTANCE,
    payload: {id, activityTypeId},
  };
};


export default {
  addActivityInstance,
  editActivityInstance,
  deleteActivityInstance,
};