import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import ActivityRow from './ActivityRow';


class ActivityList extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    activities: PropTypes.array.isRequired,
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {activities} = this.props;

    return (
      <View>
        {this.renderActivities(activities)}
      </View>
    );
  }

  renderActivities(activities) {
    return activities.map((activity, index) =>
      <ActivityRow
        name={activity.name}
        category={activity.category}
        time={activity.time}
        key={index}
      />
    )
  }
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
});


export default ActivityList;
