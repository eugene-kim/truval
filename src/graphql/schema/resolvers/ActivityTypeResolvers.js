import ActivityType from 'server/models/ActivityType';
import Category from 'server/models/Category';


export default {
  Query: {
    activityType: (root, {id}) => ActivityType.getActivityType(id),
  },
  Mutation: {
    updateActivityType: (root, args) => ActivityType.updateActivityType(args),
    deleteActivityType: (root, {id}) => ActivityType.deleteActivityType(id),
  },

  // GraphQL Type Resolvers
  ActivityType: {
    category: (activity, args) => Category.getCategory(activity.categoryId),
  },
};