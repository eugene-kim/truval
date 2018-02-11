const categoryTypeDef = `
  type Category {
    id: ID!
    name: String!
    color: String!
    isPrimary: Boolean!
    user: User!
  }

  type Query {
    categories(userId: ID!): [Category]
    category(id: ID!): Category
  }

  type Mutation {
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


export default categoryTypeDef;