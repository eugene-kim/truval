import Category from 'server/models/Category';


export default {
  Query: {
    category: (obj, {id}) => Category.getCategory(id),
  },
  Mutation: {
    createCategory: (obj, {name, color, isPrimary, userId}) => {
      const requiredParams = {name, color, user_id: userId};
      const optionalParams = {is_primary: isPrimary};

      return Category.createCategory(requiredParams, optionalParams);
    },
    updateCategory: (obj, args) => Category.updateCategory(args),
    deleteCategory: (root, {id}) => Category.deleteCategory(id),
  },
};