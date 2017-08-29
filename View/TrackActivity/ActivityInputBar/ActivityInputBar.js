import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

// Components
import ActivityTimeInput from './ActivityTimeInput';
import ActivityCategoryInput from './ActivityCategoryInput';
import ActivityNameInput from './ActivityNameInput';
import ActivitySubmitButton from './ActivitySubmitButton';


class ActivityInputBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activityStartTime: 'Default start time',
      activityCategory: 'work',
      activityName: 'Default activity name',
    };
  }

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  // --------------------------------------------------
  // Callbacks
  // --------------------------------------------------

  // TODO: Make newTime a datetime object instead of a String.
  handleTimeChange = (event) => {
    const activityStartTime = this.extractValueFromEvent(event);

    this.setState({activityStartTime});
  }

  handleCategoryChange = (event) => {
    const activityCategory = this.extractValueFromEvent(event);

    this.setState({activityCategory});
  }

  handleNameChange = (event) => {
    const activityName = this.extractValueFromEvent(event);

    this.setState({activityName});
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  extractValueFromEvent = (event) => {
    return event.nativeEvent.text;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {onSubmit} = this.props;
    const {activityStartTime, activityCategory, activityName} = this.state;
    const activity = {
      activityStartTime, activityCategory, activityName,
    }

    return (
      <View style={styles.container}>
        <ActivityTimeInput
          onTimeChange={this.handleTimeChange}
          activityStartTime={activityStartTime}
        />
        <ActivityCategoryInput
          onCategoryChange={this.handleCategoryChange}
          activityCategory={activityCategory}
        />
        <ActivityNameInput
          onNameChange={this.handleNameChange}
          activityName={activityName}
        />
        <ActivitySubmitButton
          onSubmit={onSubmit}
          activity={activity}
        />
      </View>
    );
  }
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default ActivityInputBar;
