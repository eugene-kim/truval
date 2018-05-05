import {
  OPEN_ADD_ACTIVITY_MODAL,
  CLOSE_ADD_ACTIVITY_MODAL,
  SET_RUNNING_ACTIVITY_INSTANCE,
} from '../types';


export const openAddActivityModal = () => ({
  type: OPEN_ADD_ACTIVITY_MODAL,
});

export const closeAddActivityModal = () => ({
  type: CLOSE_ADD_ACTIVITY_MODAL,
});

export const setLiveActivityInstance = id => ({
  type: SET_RUNNING_ACTIVITY_INSTANCE,
  payload: { id },
});