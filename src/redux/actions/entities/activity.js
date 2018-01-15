import types from '../types';


const addActivity = (activity = {}) => {
  return {
    type: types.ADD_ACTIVITY,
    payload: {activity},
  };
};

const editActivity = (id, newProps = {}) => {
  return {
    type: types.EDIT_ACTIVITY,
    payload: {id, newProps},
  };
};

const deleteActivity = id => {
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