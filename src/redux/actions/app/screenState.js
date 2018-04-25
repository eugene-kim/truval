import {
  OPEN_ADD_ACTIVITY_MODAL,
  CLOSE_ADD_ACTIVITY_MODAL,
} from '../types';


export const openAddActivityModal = () => ({
  type: OPEN_ADD_ACTIVITY_MODAL,
});

export const closeAddActivityModal = () => ({
  type: CLOSE_ADD_ACTIVITY_MODAL,
});