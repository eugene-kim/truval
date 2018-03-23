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

import {getGqlParamString} from 'src/graphql/util';

// Naive implementation.
// TODO: Add ability to pass props into this.
@GraphQLContainer(props => {
  const {sessionId} = props;
  const params = getGqlParamString({id: sessionId});

  return (
    `query {
      session(${params}) {
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
          sessionId,
          activityTypeId,
          activityType {
            id
            name,
            activityCount,
            categoryId,
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
  (state, props) => {
    const {sessionId} = props;

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
    const {queryIsLoading, session, activityInstances} = this.props;
    const didLoad = !queryIsLoading && session;

    if (!didLoad) {
      return (
        <Text>
          {'Loading...'}
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        <AddActivityInput
          sessionId={session.id}
        />
        <ActivityList
          activityInstances={activityInstances}
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
