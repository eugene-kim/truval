import {
  createModelInstance,
  updateModelInstance,
  getModelInstanceById,
  getOrderedModelInstances,
  deleteModelInstance,
} from '../database/dbMethods';

const SESSION_COLUMNS = [
  'id',
  'name',
  'start',
  'end',
  'is_complete',
  'user_id',
];
const SESSION_TABLE = 'Session';
const Session = {
  createSession: (requiredParams, optionalParams) => createModelInstance(
    requiredParams,
    optionalParams,
    SESSION_TABLE,
    SESSION_COLUMNS,
  ),
  getSession: id => getModelInstanceById(id, SESSION_TABLE),
  getUserSessions: userId => getOrderedModelInstances({
    foreignKeyValue: userId,
    foreignKeyName: 'user_id',
    tableName: SESSION_TABLE,
    orderByColumn: 'start',
    direction: 'desc',
  }),
  updateSession: mutationParams => updateModelInstance(
    mutationParams,
    SESSION_TABLE,
    SESSION_COLUMNS,
  ),
  deleteSession: id => deleteModelInstance(id, SESSION_TABLE),
};


export default Session;