const {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstances,
  deleteModelInstance,
} = require('../database/dbMethods');

const SESSION_COLUMNS = [
  'id',
  'name',
  'start',
  'end',
  'is_complete',
  'user_id',
];
const SESSION_TABLE = 'session';
const Session = {
  createSession: (requiredParams, optionalParams) => createModelInstance(
    requiredParams,
    optionalParams,
    SESSION_TABLE,
    SESSION_COLUMNS,
  ),
  getSession: id => getModelInstance(id, SESSION_TABLE),
  getUserSessions: userId => getModelInstances(
    userId,
    'user_id',
    SESSION_TABLE,
  ),
  updateSession: mutationParams => updateModelInstance(
    mutationParams,
    SESSION_TABLE,
    SESSION_COLUMNS,
  ),
  deleteSession: id => deleteModelInstance(id, SESSION_TABLE),
};


module.exports = Session;
