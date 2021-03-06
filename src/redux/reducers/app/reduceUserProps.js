import _ from 'src/libs/dash';
import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
} from 'src/redux/actions/types';


const reduceUserProps = (user = {}, action) => {
  const {type, payload} = action;

  switch(type) {
    case CREATE_USER_SUCCESS: {
      const {username, email} = payload;

      return _.merge({}, user, {username, email});
    }
    case CREATE_USER_FAILURE: {
      return {};
    }
    case UPDATE_USER_SUCCESS: {
      const {propsToUpdate} = payload;

      return _.merge({}, user, propsToUpdate);
    }
    case DELETE_USER_SUCCESS: {
      return {};
    }
    default:
      return user;
  }
};


export default reduceUserProps;