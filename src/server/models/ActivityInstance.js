import {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstanceById,
  getOrderedModelInstances,
  deleteModelInstance,
} from '../database/dbMethods';


const ACTIVITY_INSTANCE_TABLE = 'ActivityInstance';
const ACTIVITY_INSTANCE_COLUMNS = [
  'id',
  'is_complete',
  'start',
  'end',
  'duration',
  'session_id',
  'activity_type_id',
];

const ActivityInstance = {
  createActivityInstance: (requiredParams, optionalParams) => createModelInstance(
    requiredParams,
    optionalParams,
    ACTIVITY_INSTANCE_TABLE,
    ACTIVITY_INSTANCE_COLUMNS,
  ),
  
  getActivityInstance: id => getModelInstanceById(id, ACTIVITY_INSTANCE_TABLE),
  updateActivityInstance: mutationParams => updateModelInstance(mutationParams, ACTIVITY_INSTANCE_TABLE, ACTIVITY_INSTANCE_COLUMNS),
  deleteActivityInstance: id => deleteModelInstance(id, ACTIVITY_INSTANCE_TABLE),

  // We want the most recent activityInstances to be returned first
  getSessionActivityInstances: sessionId => getOrderedModelInstances({
    foreignKeyValue: sessionId,
    foreignKeyName: 'session_id',
    tableName: ACTIVITY_INSTANCE_TABLE,
    orderByColumn: 'start',
    direction: 'desc',
  }),
};


export default ActivityInstance;