import types from '../types';


const addActivity = function(activity = {}) {
  return {
    type: types.ADD_ACTIVITY,
    payload: {activity},
  };
};

const editActivity = function(id, newProps = {}) {
  return {
    type: types.EDIT_ACTIVITY,
    payload: {id, newProps},
  };
};

const deleteActivity = function(id) {
  return {
    type: types.DELETE_ACTIVITY,
    payload: id,
  };
};


export {
  addActivity,
  editActivity,
  deleteActivity,
};