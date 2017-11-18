import types from './types';


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

const reduceUser = function(state, action) {
  switch(action.type) {
    case types.ADD_USER: {
      const {payload} = action;

      // Payload should include the new User id.
      const {user} = payload;
      const wrapper = {
        entities: {
          [user.id]: user,
        }
      };

      return _.merge({}, state, wrapper);
    }
    case types.EDIT_USER: {
      const {payload} = action;
      const {id, newProps} = payload;
      const user = state.entities[id];
      const updatedUser = _.merge({}, user, newProps);
      const wrapper = {
        entities: {
          [id]: updatedUser,
        },
      };

      return _.merge({}, state, wrapper);
    }
    case types.DELETE_USER: {
      const {payload} = action;
      const {id} = payload;
      const remainingEntities = {
        entities: {},
      };

      state.entities.map(userId => {
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

const 

const reduceSession = function(state, action) {
  switch(action.type) {
    case types.ADD_SESSION:
    case types.EDIT_SESSION:
    case types.DELETE_SESSION:
    default:
      return state;
  }
};

const reduceActivity = function(state, action) {
  switch(action.type) {
    case types.ADD_ACTIVITY:
    case types.EDIT_ACTIVITY:
    case types.DELETE_ACTIVITY:
    default:
      return state;
  }
};

const reduceCategory = function(state, action) {
  switch(action.type) {
    case types.ADD_CATEGORY:
    case types.EDIT_CATEGORY:
    case types.DELETE_CATEGORY:
    default:
      return state;
  }
};

function focusApp(state = initialState, action) {
  const {user, session, activity, category} = state.entities;

  return {
    entities: {
      user: user(user),
      session: session(session),
      activity: activity(activity),
      category: category(category),
    }
  } 
}