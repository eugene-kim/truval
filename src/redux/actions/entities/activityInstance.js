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
import {addActivityType} from './activityType';
import {getLoneNormalizedEntity} from '../responseUtils';


export const createActivityInstance = async (activityInstance = {}, client) => dispatch => {
  dispatch(createActivityInstanceRequest(activityInstance));

  const createActivityInstanceMutation = `
    mutation {
      createActivityInstance(${getGqlParamString(activityInstance)}) {
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

    const activityInstance = getLoneNormalizedEntity('activityInstance', response);
    const activityType = getLoneNormalizedEntity('activityType', response);

    dispatch(addActivityType(activityType));    
    dispatch(createActivityInstanceSuccess(activityInstance);
  } catch (error) {
    const {message} = error;

    dispatch(createActivityInstanceFailure(message));
  }
};

const createActivityInstanceRequest = (activityInstance = {}) => ({
  type: ADD_ACTIVITY_INSTANCE_REQUEST,
  payload: {activityInstance},
});

const createActivityInstanceSuccess = (activityInstance = {}) => {
  return {
    type: ADD_ACTIVITY_INSTANCE_SUCCESS,
    payload: {activityInstance},
  };
};

const createActivityInstanceFailure = errorMessage => {
  return {
    type: ADD_ACTIVITY_INSTANCE_FAILURE,
    payload: {errorMessage},
  };
};


// TODO - do this later!
export const updateActivityInstance = (id, propsToEdit = {}) => {
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
  updateActivityInstance,
  deleteActivityInstance,
};