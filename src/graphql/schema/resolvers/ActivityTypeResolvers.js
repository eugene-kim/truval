import ActivityType from 'server/models/ActivityType';
import Category from 'server/models/Category';


export default {
  Query: {
    activityType: (root, {id}) => ActivityType.getActivityType(id),
  },
  Mutation: {
    createActivityType: (root, {name, userId, categoryId, activityCount}) => {
      const requiredParams = {
        name,
        user_id: userId,
        category_id: categoryId,
      };

      const optionalParams = {activity_count: activityCount};

      return ActivityType.createActivityType(requiredParams, optionalParams);
    },
    updateActivityType: (root, args) => ActivityType.updateActivityType(args),
    deleteActivityType: (root, {id}) => ActivityType.deleteActivityType(id),
  },

  // GraphQL Type Resolvers
  ActivityType: {
    category: (activity, args) => Category.getCategory(activity.categoryId),
  },
};