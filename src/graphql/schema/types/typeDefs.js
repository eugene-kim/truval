const typeDefs = `
  type User{
    id: ID!
    username: String!
    email: String!
    password: String!
    sessions: [Session]
    categories: [Category]
    activityTypes: [ActivityType]
  }

  type Session {
    id: ID!
    name: String

    # Datetime String in ISO 8601 format.
    start: String!

    # Datetime String in ISO 8601 format.
    end: String
    isComplete: Boolean!
    activityInstances: [ActivityInstance]!
  }

  type ActivityInstance {
    id: ID!
    name: String!

    # Datetime String in ISO 8601 format.
    start: String!

    # Datetime String in ISO 8601 format.
    end: String
    isComplete: Boolean!
    duration: Int
    session: Session!
    sessionId: ID!
    activityType: ActivityType!
    activityTypeId: ID!
  }

  type ActivityType {
    id: ID!
    name: String!
    activityCount: Int!
    category: Category!
    categoryId: ID!
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    isPrimary: Boolean!
    userId: ID!
    user: User!
  }

  type Query {
    user(id: ID!): User

    sessions(userId: ID!): [Session]
    session(id: ID!): Session

    activityType(id: ID!): ActivityType
    activityInstance(id: ID!): ActivityInstance

    categories(userId: ID!): [Category]
    category(id: ID!): Category
  }

  type Mutation {

    # User

    createUser(username: String!, email: String!, password: String!): User
    
    updateUser(id: ID!, username: String, email: String, password: String): User
    
    deleteUser(id: ID!): String!

    # Session

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

    deleteSession(id: ID!): String!

    # ActivityType

    createActivityType(
      name: String!,
      userId: ID!,
      categoryId: ID!,

      # Optional
      activityCount: Int,
    ): ActivityType

    updateActivityType(
      id: ID!,
      categoryId: ID,
      name: String,
      activityCount: Int,
    ): ActivityType
    
    deleteActivityType(id: ID!): String!

    # ActivityInstance

    createActivityInstance(
      start: String!,
      sessionId: ID!,
      activityInstanceId: ID!,

      # Optional
      end: String,
      isComplete: Boolean,
      duration: Int,
    ): ActivityInstance

    # You shouldn't be able to move an ActivityInstance from one Session to another,
    # so sessionId is not allowed in the updateActivity mutation.
    updateActivityInstance(
      id: ID!,
      start: String,
      categoryId: ID,
      end: String,
      isComplete: Boolean,
      duration: Int,
    ): ActivityInstance
    
    deleteActivityInstance(id: ID!): String!

    # Category

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
    deleteCategory(id: ID!): String!
  }
`;


export default typeDefs;