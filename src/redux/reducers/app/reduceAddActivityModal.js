import {
  CLOSE_ADD_ACTIVITY_MODAL,
  OPEN_ADD_ACTIVITY_MODAL,
} from '../../actions/types';


export default (isOpen = false, action) => {
  const {type, payload} = action;

  switch(type) {
    case OPEN_ADD_ACTIVITY_MODAL:
      return true
    case CLOSE_ADD_ACTIVITY_MODAL:
      return false
    default:
      return isOpen;
  }
}