const sessionTypeDef = `
  type Session {
    id: ID!
    name: String

    # Datetime String in ISO 8601 format.
    start: String!

    # Datetime String in ISO 8601 format.
    end: String
    isComplete: Boolean!
    activities: [Activity]!
  }

  type Query {
    sessions(userId: ID!): [Session]
    session(id: ID!): Session
  }

  type Mutation {
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
  }
`;


export default sessionTypeDef;