import _ from 'lodash';
import types from '../actions/types';


const initialState = {
  entities: {
    user: {
      entities: {},
    },

    session: {
      entities: {},
    },

    activity: {
      entities: {},
    },

    category: {
      entities: {},
    },
  },
};

const userEntities = function(state, action) {
  switch(action.type) {
    case types.ADD_USER: {
      const {payload} = action;

      // Payload should include the new User id.
      const {user} = payload;

      return _.merge({}, state, {[user.id]: user});
    }
    case types.EDIT_USER: {
      const {payload} = action;
      const {id, newProps} = payload;
      const user = state.entities[id];
      const updatedUser = _.merge({}, user, newProps);

      return _.merge({}, state, updatedUser);
    }
    case types.DELETE_USER: {
      const {payload} = action;
      const {id} = payload;
      const remainingEntities = {};

      state.map(userId => {
        if (userId !== id) {
          const user = state.entities[id];

          remainingEntities[userId] = user;
        }
      });

      return remainingEntities;
    }
    default:
      return state;
  }
};

const sessionEntities = function(state, action) {
  switch(action.type) {
    case types.ADD_SESSION: {
      const {session} = action.payload;

      return _.merge({}, state, {[session.id]: session});
    }
    case types.EDIT_SESSION: {
      const {id, newProps} = action.payload;
      const session = state[id];
      const updatedSession = _.merge({}, session, newProps);

      return _.merge({}, state, {[id]: updatedSession});
    }
    case types.DELETE_SESSION: {
      const {id} = action.payload;
      const remainingEntities = {};

      state.map(sessionId => {
        if (id !== sessionId) {
          const session = state[sessionId];

          remainingEntities[sessionId] = session;
        }
      });

      return remainingEntities;
    }
    default:
      return state;
  }
};

const activityEntities = function(state, action) {
  switch(action.type) {
    case types.ADD_ACTIVITY: {
      const {activity} = action.payload;

      return _.merge({}, state, {[activity.id]: activity});
    }
    case types.EDIT_ACTIVITY: {
      const {id, newProps} = action.payload;
      const activity = state[id];
      const updatedActivity = _.merge({}, activity, newProps);

      return _.merge({}, state, {[id]: updatedActivity});
    }
    case types.DELETE_ACTIVITY: {
      const {id} = action.payload;
      const remainingEntities = {};

      state.map(activityId => {
        if (id !== activityId) {
          const activity = state[activityId];

          remainingEntities[activityId] = activity;
        }
      });

      return remainingEntities;
    }
    default:
      return state;
  }
};

const categoryEntities = function(state, action) {
  switch(action.type) {
    case types.ADD_CATEGORY: {
      const {category} = action.payload;

      return _.merge({}, state, {[category.id]: category});
    }
    case types.EDIT_CATEGORY: {
      const {id, newProps} = action.payload;
      const category = state[id];
      const updatedCategory = _.merge({}, category, newProps);

      return _.merge({}, state, {[id]: updatedCategory});
    }
    case types.DELETE_CATEGORY: {
      const {id} = action.payload;
      const remainingEntities = {};

      state.map(categoryId => {
        if (id !== categoryId) {
          const category = state[categoryId];

          remainingEntities[categoryId] = category;
        }
      });

      return remainingEntities;
    }
    default:
      return state;
  }
};

const focusApp = function(state = initialState, action) {
  const {users, sessions, activities, categories} = state.entities;

  return {
    entities: {
      user: {
        entities: userEntities(users, action),
      },
      session: {
        entities: sessionEntities(sessions, action), 
      },
      activity: {
        entities: activityEntities(activities, action),
      },
      category: {
        entities: categoryEntities(categories, action),
      },
    }
  } 
}


export default focusApp;