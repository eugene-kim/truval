import _ from 'lodash';
import {DELETE_SESSION, ADD_SESSION, ADD_ACTIVITY} from '../../actions/types';


const sessionActivities = function(sessionActivities = {}, action) {
  switch(action.type) {
    case DELETE_SESSION: {

    }

    case ADD_SESSION: {

    }

    case ADD_ACTIVITY: {

    }

    default:
      return sessionActivities;
  }
};


export default sessionActivities;