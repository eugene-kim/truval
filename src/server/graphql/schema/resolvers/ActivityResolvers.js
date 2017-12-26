'use strict';


const Activity = require('../../../models/Activity');

const activityResolvers = {
  Query: {
    activity: (root, {id}) => Activity.getActivity(id),
  },
  Mutation: {
    createActivity: (root, {name, start, categoryId, sessionId, end, isComplete, duration}) => {
      const requiredParams = {
        name,
        start,
        category_id: categoryId,
        session_id: sessionId,
      };
      const optionalParams = {end, is_complete: isComplete, duration};

      return Activity.createActivity(requiredParams, optionalParams);
    },
    updateActivity: (root, args) => Activity.updateActivity(args),
    deleteActivity: (root, {id}) => Activity.deleteActivity(id),
  },

  // GraphQL Type Resolvers
  Activity: {
    category: (activity, args) => Activity.getCategory(activity.id),
    session: (activity, args) => Activity.getSession(activity.id),
  },
};


module.exports = activityResolvers;
