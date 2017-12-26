const userTypeDef = `
  type User{
    id: ID!
    username: String!
    email: String!
    password: String!
    sessions: [Session]
    categories: [Category]
  }

  type Query {
    user(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    updateUser(id: ID!, username: String, email: String, password: String): User
    deleteUser(id: ID!): String!
  }
`;


module.exports = userTypeDef;
