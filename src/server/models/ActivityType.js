import {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstanceById,
  getModelInstances,
  deleteModelInstance,
} from '../database/dbMethods';

const ACTIVITY_TYPE_TABLE = 'ActivityType';
const ACTIVITY_TYPE_COLUMNS = [
  'id',
  'name',
  'activity_count',
  'category_id',
  'user_id',
];

const ActivityType = {
  createActivityType: (requiredParams, optionalParams) => createModelInstance(
    requiredParams,
    optionalParams,
    ACTIVITY_TYPE_TABLE,
    ACTIVITY_TYPE_COLUMNS,
  ),
  getActivityType: id => getModelInstanceById(id, ACTIVITY_TYPE_TABLE),
  getActivityTypeByName: ({name, userId}) => getModelInstance({name, userId}, ACTIVITY_TYPE_TABLE),
  updateActivityType: mutationParams => updateModelInstance(mutationParams, ACTIVITY_TYPE_TABLE, ACTIVITY_TYPE_COLUMNS),
  deleteActivityType: id => deleteModelInstance(id, ACTIVITY_TYPE_TABLE),
  getUserActivityTypes: userId => getModelInstances(userId, 'user_id', ACTIVITY_TYPE_TABLE),
};


export default ActivityType;