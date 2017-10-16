'use strict';

const _ = require('lodash');

const knex = require('../database');

const resolvers = {
  Query: {
    allUsers: () => {
      return knex('user').select()
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
      return knex('user').first().where('id', '=', userId)
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
      return knex('session').select().where('user_id', '=', userId)
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
      return knex('session').first().where('id', '=', sessionId)
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
      return knex('activity').select().where('session_id', '=', sessionId)
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
      return knex('user').insert(args).returning('id')
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

      return knex('session').insert(dbColumns).returning(['id', 'end', 'is_complete'])
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
    createActivity: (obj, {name, start, end, isComplete, categoryId, duration}) => {
      const requiredParams = {name, start, category_id: categoryId};
      const optionalParams = cleanOptionalParams({end, is_complete: isComplete, duration});
      const dbColumns = _.merge(requiredParams, optionalParams);

      console.log(dbColumns);

      // Return optional params from the db result since they might not be provided in the GraphQL query.
      return knex('activity').insert(dbColumns).returning(['id', 'is_complete', 'start', 'end', 'duration'])
      .then(activityArray => {

        // .insert() returns an array of values based on what .returning() has specified.
        // We're inserting one object with createActivity(), so we retrieve from index 0.
        const activityFromDB = activityArray[0];
        const {id, start, end, duration} = activityFromDB;

        console.log(`start from the DB: ${start}`);
        console.log(`end from the DB: ${end}`);
        const isComplete = activityFromDB.is_complete;
        const activity = {
          id,
          name,
          start,
          end,
          duration,
          isComplete,
          categoryId,
        };

        return activity;
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

      return knex('category').insert(dbColumns).returning('id')
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
 * Takes in an object of optional GraphQL params and removes any params
 * that have undefined values. This allows for more flexible GraphQL
 * that can take in optional params while not overwriting our database
 * will undefined values if the optional params aren't provided.
 *
 * TODO: Find a home for this method.
 * TODO: Utilize immutable.js constructs.
 */
const cleanOptionalParams = optionalParams => {
  Object.keys(optionalParams).forEach(
    key => _.isUndefined(optionalParams[key]) && delete optionalParams[key]
  );

  return optionalParams;
};

module.exports = resolvers;
