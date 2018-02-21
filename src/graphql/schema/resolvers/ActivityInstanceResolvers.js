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

    if (error.message.includes('duplicate key value violates unique constraint')) {
      console.log(`ActivityType with name '${name}' already exists. Grabbing from DB.`);

      try {
        const activityType = await ActivityType.getActivityTypeByName({userId, name});

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

    async deleteActivityInstance(root, {id, activityTypeId}) {
      try {
        const rowsDeleted = await ActivityInstance.deleteActivityInstance(id);

        if (rowsDeleted === 0) {
          return rowsDeleted;
        }

        const activityType = await ActivityType.getActivityType(activityTypeId);
        const {activityCount} = activityType;
        const updatedCount = activityCount > 0 ? activityCount - 1 : activityCount;

        await ActivityType.updateActivityType({
          id: activityTypeId,
          activityCount: updatedCount,
        });

        return rowsDeleted;
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
  },

  // GraphQL Type Resolvers
  ActivityInstance: {
    activityType: (activityInstance, args) => ActivityType.getActivityType(activityInstance.activityTypeId),
    session: (activityInstance, args) => Session.getSession(activityInstance.sessionId),
  },
};


export default ActivityInstanceResolvers;