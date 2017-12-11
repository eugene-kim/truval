const activityTypeDef = `
  type Activity {
    id: ID!
    name: String!

    # Datetime String in ISO 8601 format.
    start: String!

    # Datetime String in ISO 8601 format.
    end: String
    isComplete: Boolean!
    duration: Int
    category: Category!
    session: Session!
  }

  type Query {
    activity(id: ID!): Activity
  }

  type Mutation {
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
    
    deleteActivity(id: ID!): String!
  }
`;


module.exports = activityTypeDef
