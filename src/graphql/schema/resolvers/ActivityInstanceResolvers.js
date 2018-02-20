import _ from 'lodash';

import ActivityInstance from 'server/models/ActivityInstance';
import ActivityType from 'server/models/ActivityType';
import Session from 'server/models/Session';

const getNewActivityTypeId = async args => {
  const {activityTypeId, name, categoryId, userId} = args;

  if (activityTypeId) {
    return activityTypeId;
  }

  try {
    const activityType = await ActivityType.createActivityType({name, categoryId, userId});

    return activityType.id;
  } catch (error) {

    console.log(error.message);

    if (error.message.includes('duplicate key value violates unique constraint')) {
      console.log(`ActivityType with name ${name} already exists.`);

      try {
        const activityType = await ActivityType.getActivityTypeByName(name);

        return activityType.id;
      } catch (error) {
        throw error;
      }
    }

    throw error;
  }
}

const ActivityInstanceResolvers = {
  Query: {
    activityInstance(root, {id}) {
      return ActivityInstance.getActivityInstance(id);
    },
  },

  Mutation: {
    async createActivityInstance(root, args) {
      try {
        const {

          // Required ActivityType params
          name,
          categoryId,
          userId,

          // Required ActivityInstance params
          start,
          sessionId,

          // Optional ActivityInstance params
          end,
          duration,
          isComplete,
        } = args;
        const activityTypeId = await getNewActivityTypeId(args);
        const requiredParams = {start, activityTypeId, sessionId};
        const optionalParams = {end, duration, isComplete};

        return ActivityInstance.createActivityInstance(requiredParams, optionalParams);
      } catch (error) {
        throw error;
      }
    },

    updateActivityInstance(root, args) {
      return ActivityInstance.updateActivityInstance(args);
    },

    deleteActivityInstance(root, {id}) {
      return ActivityInstance.deleteActivityInstance(id);
    },
  },

  // GraphQL Type Resolvers
  ActivityInstance: {
    activityType: (activityInstance, args) => ActivityType.getActivityType(activity.activityTypeId),
    session: (activityInstance, args) => Session.getSession(activity.sessionId),
  },
};


export default ActivityInstanceResolvers;