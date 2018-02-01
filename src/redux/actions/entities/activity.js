import {ADD_ACTIVITY, EDIT_ACTIVITY, DELETE_ACTIVITY} from '../types';


const addActivity = (activity = {}) => {
  return {
    type: ADD_ACTIVITY,
    payload: {activity},
  };
};

const editActivity = (id, newProps = {}) => {
  return {
    type: EDIT_ACTIVITY,
    payload: {id, newProps},
  };
};

const deleteActivity = id => {
  return {
    type: DELETE_ACTIVITY,
    payload: id,
  };
};


export {
  addActivity,
  editActivity,
  deleteActivity,
};