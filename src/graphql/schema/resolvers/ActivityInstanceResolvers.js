import _ from 'lodash';

import knex from 'server/database/index';
import ActivityInstance from 'server/models/ActivityInstance';
import ActivityType from 'server/models/ActivityType';
import Session from 'server/models/Session';


/**
 * Increments the related activityType's activityCount property. If an activityType
 * doesn't exist, one will be created and returned.

 * Note: I'm not happy that this method is doing multiple things at once, but I'd
 * rather reduce the number of calls made to the database.
 */
const incrementActivityTypeCount = async args => {
  const {activityTypeId, name, categoryId, userId} = args;

  if (activityTypeId) {
    const activityType = ActivityType.incrementActivityCount({id: activityTypeId});

    return activityType;
  }

  try {
    const activityType = await ActivityType.createActivityType({
      name,
      categoryId,
      userId,
      activityCount: 1,
    });

    return activityType;
  } catch (error) {

    if (error.message.includes('duplicate key value violates unique constraint')) {
      console.log(`ActivityType with name '${name}' already exists. Grabbing from DB.`);

      try {
        const activityType = await ActivityType.incrementActivityCount({name});

        return activityType;
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

        const activityType = await incrementActivityTypeCount(args);
        const activityTypeId = activityType.id;
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

        ActivityType.decrementActivityCount({id: activityTypeId});

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