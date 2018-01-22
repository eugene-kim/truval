'use strict';


const Session = require('../../../server/models/Session');
const Activity = require('../../../server/models/Activity');

const sessionResolvers = {
  Query: {
    session: (root, {id}) => Session.getSession(id),
    sessions: (root, {userId}) => Session.getUserSessions(userId),
  },
  Mutation: {
    createSession: (root, {name, start, end, isComplete, userId}) => {
      const requiredParams = {name, start, user_id: userId};
      const optionalParams = {end, is_complete: isComplete};

      return Session.createSession(requiredParams, optionalParams);
    },
    updateSession: (root, args) => Session.updateSession(args),
    deleteSession: (root, {id}) => Session.deleteSession(id),
  },

  // GraphQL Type Resolvers
  Session: {
    activities: (session, args) => Activity.getSessionActivities(session.id),
  },
};


module.exports = sessionResolvers;
