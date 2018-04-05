import _ from 'src/libs/dash';
import {
  CREATE_SESSION_SUCCESS,
  UPDATE_SESSION_SUCCESS,
  DELETE_SESSION_SUCCESS,
  UPDATE_FROM_SERVER,
} from 'src/redux/actions/types';
import {getPayloadEntities} from '../commonReducers/entityReducers';

export default (orderedSessions = [], action) => {
  const {type, payload} = action;

  switch(type) {
    case CREATE_SESSION_SUCCESS: {
      const {session} = payload;
      const {id, start} = session;

      return [{id, start}].concat(orderedSessions);
    }
    case UPDATE_SESSION_SUCCESS: {
      // TODO: Not sure if I want to let users change the start time, but I'll
      // leave case open as a placeholder for the time being.
    }
    case DELETE_SESSION_SUCCESS: {
      const {id} = payload;

      return orderedSessions.filter(orderedSession => orderedSession.id !== id);
    }
    case UPDATE_FROM_SERVER: {
      debugger
      const entitiesFromServer = getPayloadEntities(payload, 'session');
      const newOrderedSessions = orderedSessions.slice();
      const idsFromServer = Object.keys(entitiesFromServer);
      const newIds = idsFromServer.filter(
        idFromServer => !_.find(orderedSessions, orderedSession => orderedSession.id === idFromServer)
      );

      newIds.forEach(newId => {
        const start = entitiesFromServer[newId].start;
        const orderedEntry = {id: newId, start};
        const index = _.findIndex(orderedSessions, orderedSession => start <= orderedSession.start);

        if (index < 0) {
          newOrderedSessions.splice(newOrderedSessions.length, 0, orderedEntry);
        } else {
          newOrderedSessions.splice(index + 1, 0, orderedEntry);
        }
      });

      return newOrderedSessions;
    }
    default:
      return orderedSessions;
  }
}