import User from 'src/server/models/User';
import Session from 'src/server/models/Session';
import Category from 'src/server/models/Category';
import ActivityType from 'src/server/models/ActivityType';


export default {
  Query: {
    user: (root, {id}) => User.getUser(id),
  },
  Mutation: {
    createUser: (root, {username, email, password}) => {
      const requiredParams = {username, email, password};
      const optionalParams = {};

      return User.createUser(requiredParams, optionalParams);
    },
    updateUser: (root, args) => User.updateUser(args),
    deleteUser: (root, {id}) => User.deleteUser(id),
  },

  // GraphQL Type Resolvers
  User: {
    sessions: (user, args) => Session.getUserSessions(user.id),
    categories: (user, args) => Category.getUserCategories(user.id),
    activityTypes: (user, args) => ActivityType.getUserActivityTypes(user.id),
  },
};