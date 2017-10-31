const { mergeTypes } = require('merge-graphql-schemas');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const UserType = require('./types/UserType');
const SessionType = require('./types/SessionType');
const CategoryType = require('./types/CategoryType');
const ActivityType = require('./types/ActivityType');


const typeDefs = mergeTypes([UserType, SessionType, CategoryType, ActivityType]);


module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
