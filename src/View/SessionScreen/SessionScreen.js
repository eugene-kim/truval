import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// Components
import AddActivityInput from './AddActivityInput/AddActivityInput';
import ActivityList from './ActivityList';

// Hardcoding to session 1 for the time being.
const SESSION_ACTIVITIES = gql`
  query SessionActivities($sessionId: ID!){
    session(id: $sessionId) {
      id,
      name,
      activities {
        id,
        name,
        start,
        end,
        isComplete,
        duration,
        categoryId
      }
    }
  }
`;
@graphql(SESSION_ACTIVITIES, {
  options: props => ({id: props.sessionId}),
  props: ({data: {loading, session}}) => ({loading, session}),
})
class SessionScreen extends Component {

  static propTypes = {

    // Not sure if I should make this required when it might not be
    // available on screen load.
    session: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {loading, session} = this.props;
    const isLoaded = !loading && session;

    // TODO: Come up with a proper solution for loading.
    if (!isLoaded) {
      return (
        <Text>
          {'Loading...'}
        </Text>
      );
    }

    const {id} = session;
    const {activities} = session;

    return (
      <View style={styles.container}>
        <AddActivityInput
          sessionId={parseInt(id)}
        />
        <ActivityList
          isLoading={loading}
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
