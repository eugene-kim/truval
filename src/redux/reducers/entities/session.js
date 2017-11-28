import _ from 'lodash';
import types from '../../actions/types';


const sessionEntities = function(sessionEntities = {}, action) {
  switch(action.type) {
    case types.ADD_SESSION: {
      const {session} = action.payload;

      return _.merge({}, sessionEntities, {[session.id]: session});
    }
    case types.EDIT_SESSION: {
      const {id, newProps} = action.payload;
      const session = sessionEntities[id];
      const updatedSession = _.merge({}, session, newProps);

      return _.merge({}, sessionEntities, {[id]: updatedSession});
    }
    case types.DELETE_SESSION: {
      const deleteSessionId = action.payload;
      const remainingEntities = {};

      _.mapKeys(sessionEntities, (session, sessionId) => {

        if (deleteSessionId !== parseInt(sessionId)) {
          remainingEntities[sessionId] = session;
        }
      });

      return remainingEntities;
    }
    default:
      return sessionEntities;
  }
};


export default sessionEntities;