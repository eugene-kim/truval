import _ from 'lodash';
import types from '../actions/types';

// Reducer Factories
import fetchStatusReducerFactory from './factories/fetchStatusReducerFactory';
import entitiesReducerFactory from './factories/entitiesReducerFactory';
import reduceNewEntityFetchStatus from './entities/reduceNewEntity';

import activityTypeEntitiesReducer from './entities/activityTypeEntitiesReducer';

// User
import reduceUserProps from './app/reduceUserProps';
import reduceUserFetchStatus from './app/reduceUserFetchStatus';

// Ordered reducers
import reduceSessionActivities from './ordered/sessionActivities';


const getSessionEntities = state => state.session.entities;
const getSessionFetchStatus = state => state.session.fetchStatus;
const getNewSessionFetchStatus = state => state.session.new.fetchStatus;

const getCategoryEntities = state => state.category.entities;
const getCategoryFetchStatus = state => state.category.fetchStatus;
const getNewCategoryFetchStatus = state => state.category.new.fetchStatus;

const getActivityTypeEntities = state => state.activityType.entities;
const getActivityTypeFetchStatus = state => state.activityType.fetchStatus;
const getNewActivityTypeFetchStatus = state => state.activityType.new.fetchStatus;

const getActivityInstanceEntities = state => state.activityInstance.entities;
const getActivityInstanceFetchStatus = state => state.activityInstance.fetchStatus;
const getNewActivityInstanceFetchStatus = state => state.activityInstance.new.fetchStatus;

const getUserProps = state => state.app.user.props;
const getUserFetchStatus = state => state.app.user.fetchStatus;

const focusApp = function(state = {}, action) {
  return {
    entities: {
      session: {
        entities: entitiesReducerFactory('session')(getsessionEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('session')(getSessionFetchStatus(state), action),
        new: {
          fetchStatus: reduceNewEntityFetchStatus('session')(getNewSessionFetchStatus(state), action),
        }
      },
      activityType: {
        entities: activityTypeEntitiesReducer(getActivityTypeEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('activityType')(getActivityTypeFetchStatus(state), action),
        new: {
          fetchStatus: reduceNewEntityFetchStatus('activityType')(getNewActivityTypeFetchStatus(state), action),
        }
      },
      activityInstance: {
        entities: entitiesReducerFactory('activityInstance')(getActivityInstanceEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('activityInstance')(getActivityInstanceFetchStatus(state), action),
        new: {
          fetchStatus: reduceNewEntityFetchStatus('activityInstance')(getNewActivityInstanceFetchStatus(state), action),
        }
      },
      category: {
        entities: entitiesReducerFactory('category')(getCategoryEntities(state), action),
        fetchStatus: fetchStatusReducerFactory('category')(getCategoryFetchStatus(state), action),
        new: {
          fetchStatus: reduceNewEntityFetchStatus('category')(getNewCategoryFetchStatus(state), action),
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
        props: reduceUserProps(getUserProps(state)),
        fetchStatus: reduceUserFetchStatus(getUserFetchStatus(state))
      }
    },
  } 
}


export default focusApp;