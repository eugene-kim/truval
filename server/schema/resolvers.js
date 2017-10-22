'use strict';

const _ = require('lodash');
const knex = require('../database');

const USER_TABLE = 'user';
const ACTIVITY_TABLE = 'activity';
const SESSION_TABLE = 'session';
const CATEGORY_TABLE = 'category';
const userColumns = ['id', 'username', 'email', 'password'];
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
const sessionColumns = [
  'id',
  'name',
  'start',
  'end',
  'is_complete',
  'user_id',
];
const categoryColumns = ['id', 'name', 'color', 'is_primary', 'user_id'];

const resolvers = {
  Query: {
    user: (obj, {id}) => {

      // TODO: Adjust retrieveModelInstance so that it never returns the user password!
      return retrieveModelInstance(id, USER_TABLE);
    },
    sessions: (obj, {userId}) => {
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
    session: (obj, {id}) => {
      return retrieveModelInstance(id, SESSION_TABLE);
    },
    activity: (obj, {id}) => {
      return retrieveModelInstance(id, ACTIVITY_TABLE);
    },
    categories: (obj, {userId}) => {
      return knex(CATEGORY_TABLE).select().where('user_id', '=', userId)
      .then(categories => {
        return categories.map(category => toCamelCaseKeys(category));
      })
      .catch(error => console.log(error));
    },
    category: (obj, {id}) => {
      return retrieveModelInstance(id, CATEGORY_TABLE);
    }
  },
  Mutation: {
    createUser: (obj, {username, email, password}) => {
      const requiredParams = {username, email, password};
      const optionalParams = {};

      return createModelInstance(requiredParams, optionalParams, USER_TABLE, userColumns);
    },
    updateUser: (obj, args) => {
      return updateModelInstance(args, USER_TABLE, userColumns);
    },
    deleteUser: (obj, {id}) => {
      return knex(USER_TABLE).del().where('id', '=', id)
      .then(numberOfRowsDeleted => {
        return `Successfully deleted user ${id}.`
      })
      .catch(error => {
        console.log(error);

        return `Error deleting user ${id}`
      });
    },
    createSession: (obj, {name, start, end, isComplete, userId}) => {
      const requiredParams = {name, start, user_id: userId};
      const optionalParams = {end, is_complete: isComplete};

      return createModelInstance(requiredParams, optionalParams, SESSION_TABLE, sessionColumns);
    },
    updateSession: (obj, args) => {
      return updateModelInstance(args, SESSION_TABLE, sessionColumns);
    },
    createActivity: (obj, {name, start, categoryId, sessionId, end, isComplete, duration}) => {
      const requiredParams = {
        name,
        start,
        category_id: categoryId,
        session_id: sessionId,
      };
      const optionalParams = {end, is_complete: isComplete, duration};

      return createModelInstance(requiredParams, optionalParams, ACTIVITY_TABLE, activityColumns);
    },
    updateActivity: (obj, args) => {
      return updateModelInstance(args, ACTIVITY_TABLE, activityColumns);
    },
    createCategory: (obj, {name, color, isPrimary, userId}) => {
      const requiredParams = {name, color, user_id: userId};
      const optionalParams = {is_primary: isPrimary};

      return createModelInstance(requiredParams, optionalParams, CATEGORY_TABLE, categoryColumns);
    },
    updateCategory: (obj, args) => {
      return updateModelInstance(args, CATEGORY_TABLE, categoryColumns);
    }
  },

  // GraphQL Type Resolvers
  User: {
    sessions: (user, args) => {
      return knex(SESSION_TABLE).select().where('user_id', '=', user.id)
      .then(sessions => sessions.map(session => toCamelCaseKeys(session)));
    },
  },
  Session: {
    activities: (session, args) => {
      return knex(ACTIVITY_TABLE).select().where('session_id', '=', session.id)
      .then(activities => activities.map(activity => toCamelCaseKeys(activity)));
    },
  },
  Activity: {
    category: (activity, args) => {
      return knex(CATEGORY_TABLE).first().where('id', '=', activity.categoryId).
      then(category => category);
    }
  },
}

/**
 * Creates an instance of a GraphQL Type in Postgres and returns the newly
 * created object.
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
 * Updates an already existing instance of a GraphQL type in Postgres and
 * returns the updated object.
 */
const updateModelInstance = (mutationParams, tableName, columnNames) => {
  const id = mutationParams.id;
  const dbPropertiesToUpdate = makeDbCompatible(mutationParams);

  return knex(tableName)
  .update(dbPropertiesToUpdate).where('id', '=', id).returning(columnNames)
  .then(dbResults => {
    const dbResult = dbResults[0];

    console.log(dbResult);

    return toCamelCaseKeys(dbResult);
  })
  .catch(error => console.log(error));
}

const retrieveModelInstance = (id, tableName) => {
  return knex(tableName).first().where('id', '=', id)
  .then(tableRow => {
    const graphQLResponse = toCamelCaseKeys(tableRow);

    return graphQLResponse;
  })
  .catch(error => console.log(error));
}

/**
 * This method outputs an object with snake_case property names and removes
 * any properties that have undefined values.
 */
const makeDbCompatible = object => {

  // Whenever inserting or updating into the database, we shouldn't be fiddling
  // around with the object id.
  delete object.id;

  const objectWithDefinedValues = removeUndefinedProperties(object);

  return toSnakeCaseKeys(objectWithDefinedValues);
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
