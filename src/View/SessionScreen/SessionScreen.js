import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import { connect } from 'react-redux'

// Containers
import GraphQLContainer from '../containers/GraphQLContainer';

// Components
import AddActivityInput from './AddActivityInput/AddActivityInput';
import ActivityList from './ActivityList';

// Naive implementation.
@GraphQLContainer(state => {
  const sessionId = state.current.session;

  return (
    `query {
      session(id: ${sessionId}) {
        id,
        name,
        start,
        end,
        isComplete,
        activities {
          id,
          name,
          start,
          end,
          isComplete,
          duration,
        }
      }
    }`
  );
})
@connect(
  (() => {
    const mapStateToProps = state => {
      const sessionId = state.current.session;

      return {
        session: state.entities.session.entities[sessionId],
        activities: getSessionActivities(state, sessionId),
      }
    };

    const getSessionActivities = (state, sessionId) => {
      const activityIds = state.entities.session.entities[sessionId].activities;

      return activityIds.reduce((accum, activityId) => {
        const activity = state.entities.activity[activityId];

        return activity ? accum.concat(activity) : accum;
      }, []);
    };

    return mapStateToProps;
  })()
)
class SessionScreen extends Component {

  static propTypes = {

    // Not sure if I should make this required when it might not be
    // available on screen load.
    session: PropTypes.object,

    // TODO: Use a proper proptype later
    activities: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {isLoading, session} = this.props;
    const didLoad = !isLoading && session;

    // TODO: Come up with a proper solution for loading.
    if (!didLoad) {
      return (
        <Text>
          {'Loading...'}
        </Text>
      );
    }

    const id = parseInt(session.id);
    const {activities} = session;

    return (
      <View style={styles.container}>
        <AddActivityInput
          sessionId={id}
        />
        <ActivityList
          isLoading={isLoading}
          activities={activities}
        />
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Height of iOS status bar
    marginTop: 40,
  },
});


export default SessionScreen;
