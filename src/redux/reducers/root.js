import _ from 'lodash';
import types from '../actions/types';

// Entities reducers
import reduceUserEntities from './entities/user';
import reduceSessionEntities from './entities/session';
import reduceActivityTypeEntities from './entities/activityType';
import reduceActivityInstanceEntities from './entities/activityInstance';
import reduceCategoryEntities from './entities/category';

// Ordered reducers
import reduceSessionActivities from './ordered/sessionActivities';


const focusApp = function(state = {}, action) {
  const {user, session, activity, category} = state.entities;
  const {sessionActivities} = state.ordered;

  return {
    entities: {
      user: {
        entities: reduceUserEntities(user.entities, action),
      },
      session: {
        entities: reduceSessionEntities(session.entities, action),
      },
      activityType: {
        entities: reduceActivityTypeEntities(activity.entities, action),
      },
      activityInstance: {
        entities: reduceActivityInstanceEntities(activity.entities, action),
      },
      category: {
        entities: reduceCategoryEntities(category.entities, action),
      },
    },

    // Contains pointers to the currently rendered or selected object.
    current: {
      user: undefined,

      // TODO: Remove after finishing testing.
      session: 1,
      activity: undefined,
      category: undefined,
    },

    ordered: {
      sessionActivities: reduceSessionActivities(sessionActivities, action),
    },
  } 
}


export default focusApp;