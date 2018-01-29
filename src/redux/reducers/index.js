import _ from 'lodash';
import types from '../actions/types';

// Entities reducers
import reduceUserEntities from './entities/user';
import reduceSessionEntities from './entities/session';
import reduceActivityEntities from './entities/activity';
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
      activity: {
        entities: reduceActivityEntities(activity.entities, action),
      },
      category: {
        entities: reduceCategoryEntities(category.entities, action),
      },
    },

    ordered: {
      sessionActivities: reduceSessionActivities(sessionActivities, action),
    },
  } 
}


export default focusApp;