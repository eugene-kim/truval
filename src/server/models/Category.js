const {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstances,
  deleteModelInstance,
} = require('../database/dbMethods');

const CATEGORY_TABLE = 'category';
const CATEGORY_COLUMNS = ['id', 'name', 'color', 'is_primary', 'user_id'];

const Category = {
  createCategory: (requiredParams, optionalParams) => createModelInstance(
    requiredParams,
    optionalParams,
    CATEGORY_TABLE,
    CATEGORY_COLUMNS,
  ),
  getCategory: id => getModelInstance(id, CATEGORY_TABLE),
  getUserCategories: userId => getModelInstances(userId, 'user_id', CATEGORY_TABLE),
  updateCategory: mutationParams => updateModelInstance(mutationParams, CATEGORY_TABLE, CATEGORY_COLUMNS),
  deleteCategory: id => deleteModelInstance(id, CATEGORY_TABLE),
};


module.exports = Category;
