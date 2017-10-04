const Date = require('./customScalars/Date');

const users = [
  {
    id: 1,
    name: 'Eugene Kim',
    email: 'eugenekim.3.21@gmail.com',
    password: 'password',
    sessions: [],
  },
  {
    id: 2,
    name: 'Mark Miyashita',
    email: 'mark@gmail.com',
    password: 'password',
    sessions: [],
  },
  {
    id: 3,
    name: 'Sagar Shah',
    email: 'sagar@gmail.com',
    password: 'password',
    sessions: [],
  },
];

const sessions = [
];

const resolvers = {
  Date,
  Query: {
    allUsers: () => users,
    allSessions: () => [],
    allActivities: () => [],
    allCategories: () => [],
  },

  Mutation: {
    createUser: (_, data) => {
      const newUser = Object.assign({id: users.length + 1}, data);

      users.push(newUser);

      return newUser;
    }
  }
}

module.exports = resolvers;
