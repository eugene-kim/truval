import {
  ADD_ACTIVITY_INSTANCE,
  EDIT_ACTIVITY_INSTANCE,
  DELETE_ACTIVITY_INSTANCE,
} from '../types';


const addActivityInstance = (activity = {}) => {
  return {
    type: ADD_ACTIVITY_INSTANCE,
    payload: {activity},
  };
};

const editActivityInstance = (id, propsToEdit = {}) => {
  return {
    type: EDIT_ACTIVITY_INSTANCE,
    payload: {id, propsToEdit},
  };
};

const deleteActivityInstance = ({id, activityTypeId}) => {
  return {
    type: DELETE_ACTIVITY_INSTANCE,
    payload: {id, activityTypeId},
  };
};


export {
  addActivityInstance,
  editActivityInstance,
  deleteActivityInstance,
};