const {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  deleteModelInstance,
} = require('../database/dbMethods');

const USER_COLUMNS = ['id', 'username', 'email', 'password'];
const USER_TABLE = 'user';

const User = {
  getUser: id => getModelInstance(id, USER_TABLE),
  createUser: (requiredParams, optionalParams) => createModelInstance(requiredParams, optionalParams, USER_TABLE, USER_COLUMNS),
  updateUser: (updateParams) => updateModelInstance(updateParams, USER_TABLE, USER_COLUMNS),
  deleteUser: id => deleteModelInstance(id, USER_TABLE),
};


module.exports = User;
