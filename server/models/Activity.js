const {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstances,
  deleteModelInstance,
} = require('../database/dbMethods');

const ACTIVITY_TABLE = 'activity';
const ACTIVITY_COLUMNS = [
  'id',
  'name',
  'is_complete',
  'start',
  'end',
  'duration',
  'category_id',
  'session_id',
];

const Activity = {
  createActivity: (requiredParams, optionalParams) => createModelInstance(
    requiredParams,
    optionalParams,
    ACTIVITY_TABLE,
    ACTIVITY_COLUMNS,
  ),
  getActivity: id => getModelInstance(id, ACTIVITY_TABLE),
  getSessionActivities: sessionId => getModelInstances(sessionId, 'session_id', ACTIVITY_TABLE),
  updateActivity: mutationParams => updateModelInstance(mutationParams, ACTIVITY_TABLE, ACTIVITY_COLUMNS),
  deleteActivity: id => deleteModelInstance(id, ACTIVITY_TABLE),
};


module.exports = Activity;
