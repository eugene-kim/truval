import {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstances,
  deleteModelInstance,
} from '../database/dbMethods';

const CATEGORY_TABLE = 'Category';
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


export default Category;