'use strict';

const _ = require('lodash');
const knex = require('../database');
const User = require('../models/User');
const Session = require('../models/Session');
const Activity = require('../models/Activity');
const Category = require('../models/Category');

const resolvers = {
  Query: {
    user: (obj, {id}) => {

      // TODO: Adjust retrieveModelInstance so that it never returns the user password!
      return User.getUser(id);
    },
    sessions: (obj, {userId}) => Session.getUserSessions(userId),
    session: (obj, {id}) => Session.getSession(id),
    activity: (obj, {id}) => Activity.getActivity(id),
    category: (obj, {id}) => Category.getCategory(id),
  },
  Mutation: {
    createUser: (obj, {username, email, password}) => {
      const requiredParams = {username, email, password};
      const optionalParams = {};

      return User.createUser(requiredParams, optionalParams);
    },
    updateUser: (obj, args) => User.updateUser(args),
    deleteUser: (obj, {id}) => User.deleteUser(id),
    createSession: (obj, {name, start, end, isComplete, userId}) => {
      const requiredParams = {name, start, user_id: userId};
      const optionalParams = {end, is_complete: isComplete};

      return Session.createSession(requiredParams, optionalParams);
    },
    updateSession: (obj, args) => Session.updateSession(args),
    createActivity: (obj, {name, start, categoryId, sessionId, end, isComplete, duration}) => {
      const requiredParams = {
        name,
        start,
        category_id: categoryId,
        session_id: sessionId,
      };
      const optionalParams = {end, is_complete: isComplete, duration};

      return Activity.createActivity(requiredParams, optionalParams);
    },
    updateActivity: (obj, args) => Activity.updateActivity(args),
    createCategory: (obj, {name, color, isPrimary, userId}) => {
      const requiredParams = {name, color, user_id: userId};
      const optionalParams = {is_primary: isPrimary};

      return Category.createCategory(requiredParams, optionalParams);
    },
    updateCategory: (obj, args) => Category.updateCategory(args),
  },

  // GraphQL Type Resolvers
  User: {
    sessions: (user, args) => Session.getUserSessions(user.id),
    categories: (user, args) => Category.getUserCategories(user.id),
  },
  Session: {
    activities: (session, args) => Activity.getSessionActivities(session.id),
  },
};


module.exports = resolvers;
