import {
  ADD_ACTIVITY_INSTANCE,
  EDIT_ACTIVITY_INSTANCE,
  DELETE_ACTIVITY_INSTANCE,
} from '../types';


export const addActivityInstance = (activity = {}) => {
  return {
    type: ADD_ACTIVITY_INSTANCE,
    payload: {activity},
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