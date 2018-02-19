import ActivityInstance from 'server/models/ActivityInstance';
import ActivityType from 'server/models/ActivityType';
import Session from 'server/models/Session';


export default {
  Query: {
    activityInstance: (root, {id}) => ActivityInstance.getActivityInstance(id),
  },
  Mutation: {
    createActivityInstance: (root, {start, activityTypeId, sessionId, end, isComplete, duration}) => {
      const requiredParams = {
        start,
        activity_type_id: activityTypeId,
        session_id: sessionId,
      };

      const optionalParams = {
        end,
        duration,
        is_complete: isComplete,
      };

      return ActivityInstance.createActivity(requiredParams, optionalParams);
    },
    updateActivityInstance: (root, args) => ActivityInstance.updateActivityInstance(args),
    deleteActivityInstance: (root, {id}) => ActivityInstance.deleteActivityInstance(id),
  },

  // GraphQL Type Resolvers
  ActivityInstance: {
    activityType: (activityInstance, args) => ActivityType.getActivityType(activity.activityTypeId),
    session: (activityInstance, args) => Session.getSession(activity.sessionId),
  },
};