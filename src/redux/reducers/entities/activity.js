import _ from 'lodash';
import types from '../../actions/types';


const activityEntities = function(activityEntities = {}, action) {
  switch(action.type) {
    case types.ADD_ACTIVITY: {
      const {activity} = action.payload;

      return _.merge({}, activityEntities, {[activity.id]: activity});
    }
    case types.EDIT_ACTIVITY: {
      const {id, newProps} = action.payload;
      const activity = activityEntities[id];
      const updatedActivity = _.merge({}, activity, newProps);

      return _.merge({}, activityEntities, {[id]: updatedActivity});
    }
    case types.DELETE_ACTIVITY: {
      const deleteActivityId = action.payload;
      const remainingEntities = {};

      _.mapKeys(sessionEntities, (activity, activityId) => {
        if (deleteActivityId !== parseInt(activityId)) {
          const activity = activityEntities[activityId];

          remainingEntities[activityId] = activity;
        }
      });

      return remainingEntities;
    }
    default:
      return activityEntities;
  }
};


export default activityEntities;