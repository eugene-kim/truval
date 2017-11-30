import {fromJS, Map} from 'immutable';
import _ from 'lodash';
import types from '../actions/types';

// Entities reducers
import reduceUserEntities from './entities/user';
import reduceSessionEntities from './entities/session';
import reduceActivityEntities from './entities/activity';
import reduceCategoryEntities from './entities/category';

import initialState from './initialState';


const focusApp = function(state = initialState, action) {
  const {entities} = initialState;
  const {user, session, activity, category} = entities;

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
  };
}


export default focusApp;