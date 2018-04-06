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

    # Datetime String in ISO 8601 format.
    start: String!

    isComplete: Boolean!
    session: Session!
    sessionId: ID!
    activityType: ActivityType!
    activityTypeId: ID!

    # Datetime String in ISO 8601 format.
    end: String
    duration: Int
    totalDuration: Int
  }

  type ActivityType {
    id: ID!
    name: String!
    activityCount: Int!

    # Can be null if the related category was deleted.
    category: Category

    # Can be null if the related category was deleted.
    categoryId: ID
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    iconFontFamily: String
    iconName: String
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

    createUser(
      username: String!,
      email: String!,
      password: String!
    ): User
    
    updateUser(
      id: ID!,

      # Optional

      username: String,
      email: String,
      password: String
    ): User
    
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

      # Optional

      name: String,
      start: String,
      end: String,
      isComplete: Boolean
    ): Session

    deleteSession(id: ID!): String!

    # ActivityType

    updateActivityType(
      id: ID!,

      # Optional

      categoryId: ID,
      name: String,
      activityCount: Int,
    ): ActivityType
    
    # Not sure if we need this mutation - I haven't decided whether we want to delete
    # entries or just keep them in the database with activityCount set to 0,
    # which we can use to determine whether we want to render a particular
    # ActivityType or not.
    deleteActivityType(id: ID!): String!

    # ActivityInstance

    createActivityInstance(
      name: String!,
      start: String!,
      sessionId: ID!,

      # Needed if a new ActivityType is created alongside the new ActivityInstance.
      categoryId: ID!,
      userId: ID!,

      # Optional

      # The activityType may not exist for a new ActivityInstance. If it doesn't,
      # it will be created alongside the ActivityInstance.
      activityTypeId: ID,
      end: String,
      isComplete: Boolean,
      duration: Int,
    ): ActivityInstance

    # You shouldn't be able to move an ActivityInstance from one Session to another,
    # so sessionId is not allowed in the updateActivity mutation.
    updateActivityInstance(
      id: ID!,

      # Optional

      # name is technically an ActivityType field, but on ActivityInstance
      # creation in our app, the name is a field that will be submitted.
      name: String,
      start: String,
      end: String,
      isComplete: Boolean,
      duration: Int,
      activityTypeId: ID,
      categoryId: ID,
    ): ActivityInstance
    
    # Not sure what I should be returning.
    deleteActivityInstance(
      id: ID!
      activityTypeId: ID!
    ): String

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

      # Optional

      name: String,
      color: String,
      isPrimary: Boolean,
    ): Category

    deleteCategory(id: ID!): String!
  }
`;


export default typeDefs;