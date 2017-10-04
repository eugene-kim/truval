const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  scalar Date

  interface Entity {
    id: ID!
    name: String!
  }

  type User implements Entity{
    id: ID!
    name: String!
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

  type Activity implements Entity {
    id: ID!
    name: String!
    start: Date!
    end: Date
    isComplete: Boolean!
    duration: Int
    category: Category
    session: Session!
  }

  type Category implements Entity {
    id: ID!
    name: String!
    color: String!
    isPrimary: Boolean!
    user: User!
  }

  type Query {
    allUsers: [User]!
    allSessions: [Session]!
    allActivities: [Activity]!
    allCategories: [Category]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }
`;

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
