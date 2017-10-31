'use strict';


const User = require('../../models/User');
const Session = require('../../models/Session');
const Category = require('../../models/Category');

const userResolvers = {
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
  },
};


module.exports = userResolvers;
