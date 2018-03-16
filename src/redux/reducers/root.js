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
        entities: entitiesReducerFactory('session')(getSessionEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('session')(getSessionFetchStatus(state), action),
        new: {
          fetchStatus: newEntityFetchStatusReducer('session')(getNewSessionFetchStatus(state), action),
        }
      },
      activityType: {
        entities: activityTypeEntitiesReducer(getActivityTypeEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('activityType')(getActivityTypeFetchStatus(state), action),
        new: {
          fetchStatus: newEntityFetchStatusReducer('activityType')(getNewActivityTypeFetchStatus(state), action),
        }
      },
      activityInstance: {
        entities: entitiesReducerFactory('activityInstance')(getActivityInstanceEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('activityInstance')(getActivityInstanceFetchStatus(state), action),
        new: {
          fetchStatus: newEntityFetchStatusReducer('activityInstance')(getNewActivityInstanceFetchStatus(state), action),
        }
      },
      category: {
        entities: entitiesReducerFactory('category')(getCategoryEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('category')(getCategoryFetchStatus(state), action),
        new: {
          fetchStatus: newEntityFetchStatusReducer('category')(getNewCategoryFetchStatus(state), action),
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