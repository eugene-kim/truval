import _ from 'lodash';
import types from '../../actions/types';


const reduceUserEntities = function(userEntities = {}, action) {
  switch(action.type) {
    case types.ADD_USER: {
      const {payload} = action;
      const {user} = payload;

      return _.merge({}, userEntities, {[user.id]: user});
    }
    case types.EDIT_USER: {
      const {payload} = action;
      const {id, newProps} = payload;
      const user = userEntities[id];
      const updatedUser = _.merge({}, user, newProps);

      return _.merge({}, userEntities, {[id]: updatedUser});
    }
    case types.DELETE_USER: {
      const deleteUserId = action.payload;
      const remainingEntities = {};

      _.mapKeys(userEntities, (user, userId) => {
        if (deleteUserId !== parseInt(userId)) {
          const user = userEntities[deleteUserId];

          remainingEntities[userId] = user;
        }
      });

      return remainingEntities;
    }
    default:
      return userEntities;
  }
};


export default reduceUserEntities;