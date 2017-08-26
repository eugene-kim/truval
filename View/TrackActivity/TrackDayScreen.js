// TODO: think of a better name :)

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';

// Components
import ActivityInputBar from './ActivityInputBar/ActivityInputBar';
import ActivityList from './ActivityList';

// TODO: Find out if this is an appropriate location for temp data.
const activities = [
  {
    time: '10:00AM',
    category: 'FOOD',
    name: 'Eat Lunch',
  },
  {
    time: '11:00AM',
    category: 'POTTY',
    name: 'Poop',
  },
  {
    time: '12:00PM',
    category: 'WORK',
    name: 'React Native',
  },
];

class TrackDayScreen extends Component {

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  handleSubmit(activity) {
    const newActivity = {
      time: '1:00PM',
      category: 'POTTY',
      name: 'Poop',
    }

    activities.push(newActivity);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {

    return (
      <View style={styles.container}>
        <ActivityInputBar
          onSubmit={this.handleSubmit}
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

export default TrackDayScreen;
