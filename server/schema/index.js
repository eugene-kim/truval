const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  scalar Date

  type User{
    id: ID!
    username: String!
    email: String!
    password: String!
    sessions: [Session]!
  }

  type Session {
    id: ID!
    name: String
    start: Date!
    end: Date
    user: User!
    isComplete: Boolean!
    activities: [Activity]!
  }

  type Activity {
    id: ID!
    name: String!
    start: Date!
    end: Date
    isComplete: Boolean!
    duration: Int
    category: Category
    session: Session!
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    isPrimary: Boolean!
    user: User!
  }

  type Query {
    allUsers: [User]
    allSessions: [Session]
    allActivities: [Activity]
    allCategories: [Category]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
  }
`;

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
