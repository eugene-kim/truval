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
    user: (obj, {id}) => {
      return knex(USER_TABLE).first().where('id', '=', id)
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
    createUser: (obj, {username, email, password}) => {
      const requiredParams = {username, email, password};
      const optionalParams = {};
      const userColumns = ['id', 'username', 'email', 'password'];

      return createModelInstance(requiredParams, optionalParams, USER_TABLE, userColumns);
    },
    updateUser: (obj, args) => {
      const userColumns = ['id', 'username', 'email', 'password'];
      const propertiesToUpdate = removeUndefinedProperties(args);
      const dbColumnsToUpdate = toSnakeCaseKeys(propertiesToUpdate);

      return knex(USER_TABLE)
      .update(dbColumnsToUpdate).where('id', '=', args.id)
      .returning(userColumns)
      .then(users => {
        const user = users[0];

        console.log(user);

        return toCamelCaseKeys(user);
      })
      .catch(error => console.log(error));
    },
    createSession: (obj, {name, start, end, isComplete, userId}) => {
      const requiredParams = {name, start, user_id: userId};
      const optionalParams = {end, is_complete: isComplete};
      const sessionColumns = [
        'id',
        'name',
        'start',
        'end',
        'is_complete',
        'user_id',
      ];

      return createModelInstance(requiredParams, optionalParams, SESSION_TABLE, sessionColumns);
    },
    createActivity: (obj, {name, start, categoryId, sessionId, end, isComplete, duration}) => {
      const requiredParams = {
        name,
        start,
        category_id: categoryId,
        session_id: sessionId,
      };
      const optionalParams = {end, is_complete: isComplete, duration};
      const activityColumns = [
        'id',
        'name',
        'is_complete',
        'start',
        'end',
        'duration',
        'category_id',
        'session_id',
      ];

      return createModelInstance(requiredParams, optionalParams, ACTIVITY_TABLE, activityColumns);
    },
    createCategory: (obj, {name, color, isPrimary, userId}) => {
      const requiredParams = {name, color, user_id: userId};
      const optionalParams = {is_primary: isPrimary};
      const categoryColumnNames = ['id', 'name', 'color', 'is_primary', 'user_id'];

      return createModelInstance(requiredParams, optionalParams, CATEGORY_TABLE, categoryColumnNames);
    },
  }
}

/**
 * Creates an instance of a GraphQL Type in Postgres and returns the newly created object.
 */
const createModelInstance = (requiredParams, optionalParams, tableName, columnNames) => {
  optionalParams = removeUndefinedProperties(optionalParams);
  const newModelInstance = _.merge(requiredParams, optionalParams);

  return knex(tableName).insert(newModelInstance).returning(columnNames)
  .then(dbResults => {

      // .insert() returns an array of objects based on what is passed to .returning()
      // and how many objects we're inserting.
      // We're inserting one object with createModelInstance(), so we retrieve from index 0.
      const dbResult = dbResults[0];
      const response = toCamelCaseKeys(dbResult);

      return response;
  })
  .catch(error => console.log(error));
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

/**
 * Returns an object whose keys are in snake case.
 *
 * Useful when formatting an object to be put into Postgres.
 */
const toSnakeCaseKeys = object => _.mapKeys(object, (value, key) => _.snakeCase(key));

module.exports = resolvers;
