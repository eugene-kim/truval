import {ADD_ACTIVITY_TYPE, EDIT_ACTIVITY_TYPE, DELETE_ACTIVITY_TYPE} from '../types';


const addActivityType = (activity = {}) => {
  return {
    type: ADD_ACTIVITY_TYPE,
    payload: {activity},
  };
};

const editActivityType = (id, propsToEdit = {}) => {
  return {
    type: EDIT_ACTIVITY_TYPE,
    payload: {id, propsToEdit},
  };
};

const deleteActivityType = id => {
  return {
    type: DELETE_ACTIVITY_TYPE,
    payload: id,
  };
};


export {
  addActivityType,
  editActivityType,
  deleteActivityType,
};