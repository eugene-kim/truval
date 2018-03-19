import _ from 'lodash';
import types from '../actions/types';

// Reducer Factories
import fetchStatusReducerFactory from './factories/fetchStatusReducerFactory';
import entitiesReducerFactory from './factories/entitiesReducerFactory';
import newEntityFetchStatusReducer from './factories/newEntityFetchStatusReducer';

import activityTypeEntitiesReducer from './entities/activityTypeEntitiesReducer';

// Selectors
import {
  getSessionEntities,
  getSessionFetchStatus,
  getNewSessionFetchStatus,
  getCategoryEntities,
  getCategoryFetchStatus,
  getNewCategoryFetchStatus,
  getActivityTypeEntities,
  getActivityTypeFetchStatus,
  getNewActivityTypeFetchStatus,
  getActivityInstanceEntities,
  getActivityInstanceFetchStatus,
  getNewActivityInstanceFetchStatus,
} from './selectors/entitySelectors';

import {
  getUserProps,
  getUserFetchStatus,
} from './selectors/appSelectors';

// User
import reduceUserProps from './app/reduceUserProps';
import reduceUserFetchStatus from './app/reduceUserFetchStatus';


const focusApp = function(state = {}, action) {
  return {
    entities: {
      session: {
        entities: entitiesReducerFactory({
          entityType: 'session',
          entities: getSessionEntities(state),
          action,
        }),
        fetchStatus: fetchStatusReducerFactory({
          entityType: 'session',
          fetchStatuses: getSessionFetchStatus(state),
          action,
        }),
        new: {
          fetchStatus: newEntityFetchStatusReducer({
            entityType: 'session',
            newFetchStatus: getNewSessionFetchStatus(state),
            action,
          }),
        }
      },
      activityType: {
        entities: activityTypeEntitiesReducer(getActivityTypeEntities(state), action),
        fetchStatus: fetchStatusReducerFactory({
          entityType: 'activityType',
          fetchStatuses: getActivityTypeFetchStatus(state),
          action,
        }),
        new: {
          fetchStatus: newEntityFetchStatusReducer({
            entityType: 'activityType',
            newFetchStatus: getNewActivityTypeFetchStatus(state),
            action,
          }),
        }
      },
      activityInstance: {
        entities: entitiesReducerFactory({
          entityType: 'activityInstance',
          entities: getActivityInstanceEntities(state),
          action,
        }),
        fetchStatus: fetchStatusReducerFactory({
          entityType: 'activityInstance',
          fetchStatuses: getActivityInstanceFetchStatus(state),
          action,
        }),
        new: {
          fetchStatus: newEntityFetchStatusReducer({
            entityType: 'activityInstance',
            newFetchStatus: getNewActivityInstanceFetchStatus(state),
            action,
          }),
        }
      },
      category: {
        entities: entitiesReducerFactory({
          entityType: 'category',
          entities: getCategoryEntities(state),
          action,
        }),
        fetchStatus: fetchStatusReducerFactory({
          entityType: 'category',
          fetchStatuses: getCategoryFetchStatus(state),
          action,
        }),
        new: {
          fetchStatus: newEntityFetchStatusReducer({
            entityType: 'category',
            newFetchStatus: getNewCategoryFetchStatus(state),
            action,
          }),
        }
      },
    },

    // Contains pointers to the currently rendered or selected object.
    current: {
      
      // TODO: Remove after finishing testing.
      session: 1,
      activityInstance: undefined,
      category: undefined,
    },

    app: {
      user: {
        props: reduceUserProps(getUserProps(state), action),
        fetchStatus: reduceUserFetchStatus(getUserFetchStatus(state), action),
      },
    },
  }
}


export default focusApp;