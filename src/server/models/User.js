import {
  createModelInstance,
  updateModelInstance,
  getModelInstanceById,
  deleteModelInstance,
} from '../database/dbMethods';

const USER_COLUMNS = ['id', 'username', 'email', 'password'];
const USER_TABLE = 'User';

const User = {
  getUser: id => getModelInstanceById(id, USER_TABLE),
  createUser: (requiredParams, optionalParams) => createModelInstance(requiredParams, optionalParams, USER_TABLE, USER_COLUMNS),
  updateUser: (updateParams) => updateModelInstance(updateParams, USER_TABLE, USER_COLUMNS),
  deleteUser: id => deleteModelInstance(id, USER_TABLE),
};


export default User;
