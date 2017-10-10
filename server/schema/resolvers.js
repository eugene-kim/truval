const _ = require('lodash');

const knex = require('../database');
const Date = require('./customScalars/Date');

const resolvers = {
  Date,
  Query: {
    allUsers: () => {
      return knex('user').select()
      .then((rows) => {
        const result = rows.map(row => ({
          id: row.id,
          username: row.username,
          email: row.email,
          password: row.password,
        }));

        console.log(result);

        return result;
      })
      .catch(error => console.log(error));
    },
    allSessions: () => [],
    allActivities: () => [],
    allCategories: () => [],
  },

  Mutation: {
    createUser: (obj, args) => {
      return knex('user').insert(args).returning('id')
      .then(idArray => {
        const id = idArray[0];
        const user = _.merge(args, {id})

        console.log(user);

        return user;
      })
      .catch(error => console.log(error));
    }
  }
}

module.exports = resolvers;
