import _ from 'src/libs/dash';

import {
  createEntity,
  updateEntity,
  deleteEntity,
  hydrateEntities,
} from '../commonReducers/entityReducers';
import {
  CREATE_SESSION_SUCCESS,
  UPDATE_SESSION_SUCCESS,
  DELETE_SESSION_SUCCESS,
  UPDATE_FROM_SERVER,
  CREATE_ACTIVITY_INSTANCE_SUCCESS,
} from 'src/redux/actions/types';


// TODO: creating and deleting should update related entries as well
const sessionEntitiesReducer = (sessionEntities, action) => {
  const {type, payload} = action;

  switch(type) {
    case CREATE_SESSION_SUCCESS: {
      return createEntity(action, 'session')(sessionEntities);
    }
    case UPDATE_SESSION_SUCCESS: {
      return updateEntity(action)(sessionEntities);
    }
    case DELETE_SESSION_SUCCESS: {
      return deleteEntity(action)(sessionEntities);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateEntities({entities: sessionEntities, action, entityType: 'session'});
    }
    case CREATE_ACTIVITY_INSTANCE_SUCCESS: {
      const {activityInstance} = payload;
      const {id, sessionId} = activityInstance;
      const session = sessionEntities[sessionId];
      const activityInstances = session.activityInstances || [];
      const updateAction = {
        payload: {
          id: sessionId,
          propsToUpdate: {

            // Activity instances are ordered newest --> oldest.
            activityInstances: [id].concat(activityInstances),
          },
        },
      };

      return updateEntity(updateAction)(sessionEntities);
    }
    default:
      return sessionEntities;
  }
};



export default sessionEntitiesReducer;