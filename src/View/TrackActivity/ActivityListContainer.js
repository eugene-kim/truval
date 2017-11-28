import { connect } from 'react-redux';
import ActivityList from './ActivityList';



const getSessionActivities = (sessionId, activities) => 
  Object.keys(activities)
        .filter(activityId => {
          const activity = activities[activityId];

          return sessionId === activity.sessionId;
        })
        .reduce((sessionActivities, activityId) => {
          sessionActivities[activityId] = activities[activityId];
        }, {});

const mapStateToProps = state => ({
  const entities = state.entities;
  const {currentSession} = entities.session;
  const activities = entities.activity.entities;

  return {
    activities: getSessionActivities(currentSession, activities),
  };
});

export const ActivityListContainer = connect(
  mapStateToProps,
)(SessionScreen);