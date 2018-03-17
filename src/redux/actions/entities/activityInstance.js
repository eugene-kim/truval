import {getGqlParamString} from 'src/graphql/util';
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
import {addActivityType, updateActivityTypeSuccess} from './activityType';
import {getLoneNormalizedEntity} from '../responseUtil';


export const createActivityInstance = (activityInstance = {}, client) => async dispatch => {
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
    dispatch(createActivityInstanceSuccess(activityInstance));
  } catch (error) {
    const {message} = error;

    dispatch(createActivityInstanceFailure(message));
  }
};

export const createActivityInstanceRequest = (activityInstance = {}) => ({
  type: CREATE_ACTIVITY_INSTANCE_REQUEST,
  payload: {activityInstance},
});

export const createActivityInstanceSuccess = (activityInstance = {}) => {
  return {
    type: CREATE_ACTIVITY_INSTANCE_SUCCESS,
    payload: {activityInstance},
  };
};

export const createActivityInstanceFailure = errorMessage => {
  return {
    type: CREATE_ACTIVITY_INSTANCE_FAILURE,
    payload: {errorMessage},
  };
};

export const updateActivityInstance = ({id, propsToUpdate = {}, client}) => async dispatch => {
  dispatch(updateActivityInstanceRequest({id, propsToUpdate}));

  const params = getGqlParamString({id, ...propsToUpdate});
  const updateActivityInstanceMutation = `
    mutation {
      updateActivityInstance(${params})
    }
  `;

  try {
    await client.mutate(updateActivityInstanceMutation);

    dispatch(updateActivityInstanceSuccess({id, propsToUpdate}));
  } catch (error) {
    const {message} = error;

    dispatch(updateActivityInstanceFailure({
      id,
      errorMessage: message,
    }));
  }
};

export const updateActivityInstanceRequest = ({id, propsToUpdate = {}}) => ({
  type: UPDATE_ACTIVITY_INSTANCE_REQUEST,
  payload: {id, propsToUpdate},
});

export const updateActivityInstanceSuccess = ({id, propsToUpdate = {}}) => ({
  type: UPDATE_ACTIVITY_INSTANCE_SUCCESS,
  payload: {id, propsToUpdate},
});

export const updateActivityInstanceFailure = ({id, errorMessage}) => ({
  type: UPDATE_ACTIVITY_INSTANCE_FAILURE,
  payload: {id, errorMessage},
});

export const deleteActivityInstance = ({id, activityType, client}) => async dispatch => {
  debugger
  const activityTypeId = activityType.id;
  const {activityCount} = activityType;

  dispatch(deleteActivityInstanceRequest({id, activityTypeId}));

  const params = getGqlParamString({id, activityTypeId});
  const deleteActivityInstanceMutation = `
    mutation {
      deleteActivityInstance(${params})
    }
  `;

  try {
    client.mutate(deleteActivityInstanceMutation);

    dispatch(deleteActivityInstanceSuccess({id, activityTypeId}));

    // Directly update the store with updateActivityTypeSuccess() since the update
    // to activityCount has already been made server side.
    const updateActivityTypeAction = updateActivityTypeSuccess({
      id: activityTypeId,
      propsToUpdate: {activityCount: activityCount - 1},
    });

    dispatch(updateActivityTypeAction);
  } catch (error) {
    const {message} = error;

    dispatch(deleteActivityInstanceFailure({id, message}));
  }
};

export const deleteActivityInstanceRequest = ({id, activityTypeId}) => ({
  type: DELETE_ACTIVITY_INSTANCE_REQUEST,
  payload: {id, activityTypeId},
});

export const deleteActivityInstanceSuccess = ({id, activityTypeId}) => ({
  type: DELETE_ACTIVITY_INSTANCE_SUCCESS,
  payload: {id, activityTypeId},
});

export const deleteActivityInstanceFailure = ({id, errorMessage}) => ({
  type: DELETE_ACTIVITY_INSTANCE_FAILURE,
  payload: {id, errorMessage},
});