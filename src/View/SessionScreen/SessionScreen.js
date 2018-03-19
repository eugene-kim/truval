
import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, View, Text} from 'react-native';
import { connect } from 'react-redux'

// Containers
import GraphQLContainer from '../containers/GraphQLContainer';

// Selectors
import {
  getEntityById,
  getSessionActivityInstances,
} from 'src/redux/reducers/selectors/entitySelectors';

// Components
import AddActivityInput from './AddActivityInput/AddActivityInput';
import ActivityList from './ActivityList';

// Naive implementation.
// TODO: Add ability to pass props into this.
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
        activityInstances {
          id,
          start,
          end,
          isComplete,
          duration,
          activityType {
            id
            name,
            activityCount,
            category {
              id,
              name
              color
            }
          }
        }
      }
    }`
  );
})
@connect(

  // mapStateToProps
  (state, ownProps) => {
    const {sessionId} = ownProps;

    return {
      session: getEntityById({id: sessionId, entityType: 'session', state}),
      activityInstances: getSessionActivityInstances({state, sessionId}),
    }
  },
)
class SessionScreen extends Component {

  static propTypes = {

    // Not sure if I should make this required when it might not be
    // available on screen load.
    session: PropTypes.object,

    // TODO: Use a proper proptype later
    activityInstances: PropTypes.array,
    queryIsLoading: PropTypes.bool.isRequired,
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {queryIsLoading, session, activities} = this.props;
    const didLoad = !queryIsLoading && session;

    if (!didLoad) {
      return (
        <Text>
          {'Loading...'}
        </Text>
      );
    }

    const {id} = session.id;

    return (
      <View style={styles.container}>
        <AddActivityInput
          sessionId={id}
        />
        <ActivityList
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
