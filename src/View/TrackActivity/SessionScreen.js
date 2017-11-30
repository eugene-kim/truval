import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// Components
import AddActivityInput from './AddActivityInput/AddActivityInput';
import ActivityList from './ActivityList';


class SessionScreen extends Component {
  constructor(props) {
    super(props);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {loading, session} = this.props;
    const activities = loading ? [] : session.activities;

    return (
      <View style={styles.container}>
        <AddActivityInput />
        <ActivityList
          activities={activities}
        />
      </View>
    );
  }
};

// Hardcoding to session 1 for the time being.
const ACTIVITIES_QUERY = gql`
  query {
    session(id:1) {
      name,
      activities {
        id,name,start,end,isComplete,duration,categoryId
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Height of iOS status bar
    marginTop: 40,
  },
});

export default graphql(ACTIVITIES_QUERY, {
  props: ({data: {loading, session}}) => ({loading, session})
})(SessionScreen);
