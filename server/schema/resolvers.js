'use strict';

const _ = require('lodash');
const knex = require('../database');

const USER_TABLE = 'user';
const ACTIVITY_TABLE = 'activity';
const SESSION_TABLE = 'session';
const CATEGORY_TABLE = 'category';

const resolvers = {
  Query: {
    allUsers: () => {
      return knex(USER_TABLE).select()
      .then(rows => {
        console.log(rows);

        return rows.map(({id, username, email, password}) => ({
          id,
          username,
          email,
          password,
        }));
      })
      .catch(error => console.log(error));
    },
    user: (obj, {userId}) => {
      return knex(USER_TABLE).first().where('id', '=', userId)
      .then(row => {
        console.log(row);

        return {
          id: row.id,
          username: row.username,
          email: row.email,
          password: row.password,
        }
      })
      .catch(error => console.log(error));
    },
    allSessions: (obj, {userId}) => {
      return knex(SESSION_TABLE).select().where('user_id', '=', userId)
      .then(rows => {
        console.log(rows);

        return rows.map(({id, name, start, end, is_complete}) => ({
          id,
          name,
          start,
          end,
          isComplete: is_complete,
        }));
      })
      .catch(error => console.log(error));
    },
    session: (obj, {sessionId}) => {
      return knex(SESSION_TABLE).first().where('id', '=', sessionId)
      .then(session => {
        console.log(session);

        return {
          id: session.id,
          name: session.name,
          start: session.start,
          end: session.end,
          isComplete: session.is_complete,
        };
      })
      .catch(error => console.log(error));
    },
    allActivities: (obj, {sessionId}) => {
      return knex(ACTIVITY_TABLE).select().where('session_id', '=', sessionId)
      .then(activities => {
        console.log(activities);

        return activities.map(({id, name, start, end, is_complete, duration, category}) => ({
          id,
          name,
          start,
          end,
          isComplete: is_complete,
          duration,
          categoryId: category_id,
        }))
      })
      .catch(error => console.log(error));
    },
    allCategories: (obj, {userId}) => {
    },
  },

  Mutation: {
    createUser: (obj, args) => {
      return knex(USER_TABLE).insert(args).returning('id')
      .then((idArray) => {
        const id = idArray[0];
        const user = _.merge(args, {id});

        return user;
      })
      .catch(error => console.log(error));
    },
    createSession: (obj, {name, start, end, isComplete, userId}) => {
      const dbColumns = {
        name,
        start,
        end,
        is_complete: isComplete,
        user_id: userId,
      };

      return knex(SESSION_TABLE).insert(dbColumns).returning(['id', 'end', 'is_complete'])
      .then(sessionArray => {
        const dbResponse = sessionArray[0];

        // Grab these values from the DB because they might not be provided in the GraphQL query.
        const {id, end, is_complete} = dbResponse;
        const response = {id, name, start, end, isComplete, userId};

        console.log(response);

        return response;
      })
      .catch(error => console.log(error));
    },
    createActivity: (obj, {name, start, categoryId, sessionId, end, isComplete, duration}) => {
      const requiredParams = {
        name,
        start,
        category_id: categoryId,
        session_id: sessionId,
      };

      const optionalParams = removeUndefinedProperties({
        end,
        is_complete: isComplete,
        duration,
      });

      const newActivity = _.merge(requiredParams, optionalParams);
      const activityColumns = ['id', 'name', 'is_complete', 'start', 'end', 'duration', 'category_id', 'session_id'];

      return knex(ACTIVITY_TABLE).insert(newActivity).returning(activityColumns)
      .then(activities => {

        // .insert() returns an array of objects based on what is passed to .returning()
        // and how many objects we're inserting.
        // We're inserting one object with createActivity(), so we retrieve from index 0.
        const activity = activities[0];
        const response = toCamelCaseKeys(activity);

        return response;
      })
      .catch(error => console.log(error))
    },
    createCategory: (obj, {name, color, isPrimary, userId}) => {
      const dbColumns = {
        name,
        color,
        is_primary: isPrimary,
        user_id: userId,
      }

      return knex(CATEGORY_TABLE).insert(dbColumns).returning('id')
      .then(idArray => {
        const id = idArray[0];
        const category = {
          id, name, color, isPrimary, userId
        };

        return category;
      })
      .catch(error => console.log(error));
    },
  }
}

/**
 * Removes object properties that have undefined values.
 *
 * Useful when handling GraphQL queries that contain optional parameters.
 * When inserting or updating into the database, the resolver functions create an
 * object to be put into the database that include optional parameters, whether they
 * contain values or not. This results in undefined optional parameter values if
 * they haven't been provided. If they aren't removed prior to insertion / an update,
 * the database row will be updated with a `null` value instead of utilizing the table default.
 *
 * TODO: Find a home for this method.
 * TODO: Utilize immutable.js constructs.
 * TODO: Add tests.
 */
const removeUndefinedProperties = object => {
  Object.keys(object).forEach(
    key => _.isUndefined(object[key]) && delete object[key]
  );

  return object;
};

/**
 * Returns an object whose keys are in camel case.
 *
 * Useful when returning an object returned by Postgres that's in snake_case
 * into a properly formatted GraphQL response.
 */
const toCamelCaseKeys = object => _.mapKeys(object, (value, key) => _.camelCase(key));


module.exports = resolvers;
