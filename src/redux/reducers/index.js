import _ from 'lodash';
import types from '../actions/types';


const userEntities = function(userEntities = {}, action) {
  switch(action.type) {
    case types.ADD_USER: {
      const {payload} = action;

      // Payload should include the new User id.
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

const sessionEntities = function(sessionEntities = {}, action) {
  switch(action.type) {
    case types.ADD_SESSION: {
      const {session} = action.payload;

      return _.merge({}, sessionEntities, {[session.id]: session});
    }
    case types.EDIT_SESSION: {
      const {id, newProps} = action.payload;
      const session = sessionEntities[id];
      const updatedSession = _.merge({}, session, newProps);

      return _.merge({}, sessionEntities, {[id]: updatedSession});
    }
    case types.DELETE_SESSION: {
      const deleteSessionId = action.payload;
      const remainingEntities = {};

      _.mapKeys(sessionEntities, (session, sessionId) => {

        if (deleteSessionId !== parseInt(sessionId)) {
          remainingEntities[sessionId] = session;
        }
      });

      return remainingEntities;
    }
    default:
      return sessionEntities;
  }
};

const activityEntities = function(activityEntities = {}, action) {
  switch(action.type) {
    case types.ADD_ACTIVITY: {
      const {activity} = action.payload;

      return _.merge({}, activityEntities, {[activity.id]: activity});
    }
    case types.EDIT_ACTIVITY: {
      const {id, newProps} = action.payload;
      const activity = activityEntities[id];
      const updatedActivity = _.merge({}, activity, newProps);

      return _.merge({}, activityEntities, {[id]: updatedActivity});
    }
    case types.DELETE_ACTIVITY: {
      const deleteActivityId = action.payload;
      const remainingEntities = {};

      _.mapKeys(sessionEntities, (activity, activityId) => {
        if (deleteActivityId !== parseInt(activityId)) {
          const activity = activityEntities[activityId];

          remainingEntities[activityId] = activity;
        }
      });

      return remainingEntities;
    }
    default:
      return activityEntities;
  }
};

const categoryEntities = function(categoryEntities = {}, action) {
  switch(action.type) {
    case types.ADD_CATEGORY: {
      const {category} = action.payload;

      return _.merge({}, categoryEntities, {[category.id]: category});
    }
    case types.EDIT_CATEGORY: {
      const {id, newProps} = action.payload;
      const category = categoryEntities[id];
      const updatedCategory = _.merge({}, category, newProps);

      return _.merge({}, categoryEntities, {[id]: updatedCategory});
    }
    case types.DELETE_CATEGORY: {
      const {id} = action.payload;
      const remainingEntities = {};

      _.mapKeys(sessionEntities, (category, categoryId) => {
        if (id !== parseInt(categoryId)) {
          const category = categoryEntities[categoryId];

          remainingEntities[categoryId] = category;
        }
      });

      return remainingEntities;
    }
    default:
      return categoryEntities;
  }
};

const focusApp = function(state = {}, action) {
  const {user, session, activity, category} = state.entities;

  return {
    entities: {
      user: {
        entities: userEntities(user.entities, action),
      },
      session: {
        entities: sessionEntities(session.entities, action), 
      },
      activity: {
        entities: activityEntities(activity.entities, action),
      },
      category: {
        entities: categoryEntities(category.entities, action),
      },
    }
  } 
}


export default focusApp;