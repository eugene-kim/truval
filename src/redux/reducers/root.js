import _ from 'lodash';
import types from '../actions/types';

// Reducer Factories
import fetchStatusReducerFactory from './factories/fetchStatusReducerFactory';
import entitiesReducerFactory from './factories/entitiesReducerFactory';
import newEntityFetchStatusReducer from './factories/newEntityFetchStatusReducer';

import activityTypeEntitiesReducer from './entities/activityTypeEntitiesReducer';

// User
import reduceUserProps from './app/reduceUserProps';
import reduceUserFetchStatus from './app/reduceUserFetchStatus';


const getSessionEntities = state => state.entities.session.entities;
const getSessionFetchStatus = state => state.entities.session.fetchStatus;
const getNewSessionFetchStatus = state => state.entities.session.new.fetchStatus;

const getCategoryEntities = state => state.entities.category.entities;
const getCategoryFetchStatus = state => state.entities.category.fetchStatus;
const getNewCategoryFetchStatus = state => state.entities.category.new.fetchStatus;

const getActivityTypeEntities = state => state.entities.activityType.entities;
const getActivityTypeFetchStatus = state => state.entities.activityType.fetchStatus;
const getNewActivityTypeFetchStatus = state => state.entities.activityType.new.fetchStatus;

const getActivityInstanceEntities = state => state.entities.activityInstance.entities;
const getActivityInstanceFetchStatus = state => state.entities.activityInstance.fetchStatus;
export const getNewActivityInstanceFetchStatus = state => state.entities.activityInstance.new.fetchStatus;

const getUserProps = state => state.app.user.props;
const getUserFetchStatus = state => state.app.user.fetchStatus;

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