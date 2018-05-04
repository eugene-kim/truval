import { SET_RUNNING_ACTIVITY_INSTANCE } from '../../actions/types';


export default (id = undefined, action) => {
  const {type, payload} = action;

  switch(type) {
    case SET_RUNNING_ACTIVITY_INSTANCE:
      return payload.id
    default:
      return id;
  }
}