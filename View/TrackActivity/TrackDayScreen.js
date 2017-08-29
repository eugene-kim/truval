// TODO: think of a better name :)

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';

// Components
import ActivityInputBar from './ActivityInputBar/ActivityInputBar';
import ActivityList from './ActivityList';

class TrackDayScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [
        {
          activityStartTime: '10:00AM',
          activityCategory: 'FOOD',
          activityName: 'Eat Lunch',
        },
        {
          activityStartTime: '11:00AM',
          activityCategory: 'POTTY',
          activityName: 'Poop',
        },
        {
          activityStartTime: '12:00PM',
          activityCategory: 'WORK',
          activityName: 'React Native',
        },
      ],
    };
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  handleSubmit = (activity) => {
    this.setState({activities: this.state.activities.concat([activity])});
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {activities} = this.state;

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
