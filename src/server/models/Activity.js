import {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstances,
  deleteModelInstance,
} from '../database/dbMethods';

import Session from './Session';
import Category from './Category';

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

  // HACK until we add a notion of an instance.
  getSession: async id => {
    const activity = await Activity.getActivity(id);
    const {sessionId} = activity;

    console.log(activity);

    return Session.getSession(sessionId);
  },

  // HACK until we add a notion of an instance.
  getCategory: async id => {
    const activity = await Activity.getActivity(id);
    const {categoryId} = activity;

    console.log(activity);

    return Category.getCategory(categoryId);
  },
  getSessionActivities: sessionId => getModelInstances(sessionId, 'session_id', ACTIVITY_TABLE),
  updateActivity: mutationParams => updateModelInstance(mutationParams, ACTIVITY_TABLE, ACTIVITY_COLUMNS),
  deleteActivity: id => deleteModelInstance(id, ACTIVITY_TABLE),
};


export default Activity;