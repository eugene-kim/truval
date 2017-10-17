const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
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

    # Datetime String in ISO 8601 format.
    start: String!

    # Datetime String in ISO 8601 format.
    end: String
    user: User!
    isComplete: Boolean!
    activities: [Activity]!
  }

  type Activity {
    id: ID!
    name: String!

    # Datetime String in ISO 8601 format.
    start: String!

    # Datetime String in ISO 8601 format.
    end: String
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
    user(id: ID!): User

    allSessions(userId: ID!): [Session]
    session(sessionId: ID!): Session

    allActivities(sessionId: ID!): [Activity]
    activity(activityId: ID!): Activity

    allCategories(userId: ID!): [Category]
    category(categoryId: ID!): Category
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    updateUser(id: ID!, username: String, email: String, password: String): User

    createSession(
      name: String!,
      start: String!,
      userId: ID!

      # Optional
      end: String,
      isComplete: Boolean,
    ): Session

    # You shouldn't be able to move a Session from one User to another, so
    # userId is not included in the updateSession mutation.
    updateSession(
      id: ID!,
      name: String,
      start: String,
      end: String,
      isComplete: Boolean
    ): Session

    createActivity(
      name: String!,
      start: String!,
      categoryId: ID!,
      sessionId: ID!,

      # Optional
      end: String,
      isComplete: Boolean,
      duration: Int,
    ): Activity

    # You shouldn't be able to move an Activity from one Session to another,
    # so sessionId is not allowed in the updateActivity mutation.
    updateActivity(
      id: ID!,
      name: String,
      start: String,
      categoryId: ID,
      end: String,
      isComplete: Boolean,
      duration: Int,
    ): Activity

    createCategory(
      name: String!,
      color: String!,
      userId: ID!,

      # Optional
      isPrimary: Boolean,
    ): Category

    # You shouldn't be able to move a category from one User to another,
    # so userId is not included in the updateCategory mutation.
    updateCategory(
      id: ID!,
      name: String,
      color: String,
      isPrimary: Boolean,
    ): Category
  }
`;

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
