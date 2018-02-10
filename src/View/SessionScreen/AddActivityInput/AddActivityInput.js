import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';

import Datetime from 'libs/util/Datetime';
import bind from 'libs/decorators/bind';

// Components
import ActivityTimeInput from './ActivityTimeInput';
import ActivityCategoryInput from './ActivityCategoryInput';
import ActivityNameInput from './ActivityNameInput';
import ActivitySubmitButton from './ActivitySubmitButton';


class AddActivityInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activityStartTime: new Datetime().toString(),
      activityCategory: '',
      activityName: '',
    };
  }

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    sessionId: PropTypes.number.isRequired,
  };

  // --------------------------------------------------
  // Lifecycle Methods
  // --------------------------------------------------
  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 300);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  tick() {
    const datetime = new Datetime();

    datetime.isNewMinute() && this.setState({activityStartTime: datetime.toString()});
  }

  extractValueFromEvent(event) {
    return event.nativeEvent.text;
  }

  // --------------------------------------------------
  // Callbacks
  // --------------------------------------------------

  @bind
  handleTimeChange (event) {
    const activityStartTime = this.extractValueFromEvent(event);

    this.setState({activityStartTime});
  }

  @bind
  handleCategoryChange (event) {
    const activityCategory = this.extractValueFromEvent(event);

    this.setState({activityCategory});
  }

  @bind
  handleNameChange (event) {
    const activityName = this.extractValueFromEvent(event);

    this.setState({activityName});
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {sessionId} = this.props;
    const {activityStartTime, activityCategory, activityName} = this.state;
    const newActivity = {
      sessionId,
      name: activityName,
      start: activityStartTime,
      categoryId: parseInt(activityCategory),
      isComplete: false,
    };

    // Not rendering the submit button for now
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ActivityTimeInput
            onTimeChange={this.handleTimeChange}
            activityStartTime={activityStartTime}
            style={styles.timeInput}
          />
          <ActivityNameInput
            onNameChange={this.handleNameChange}
            activityName={activityName}
            style={styles.nameInput}
          />
          <ActivityCategoryInput
            onCategoryChange={this.handleCategoryChange}
            activityCategory={activityCategory}
            style={styles.categoryInput}
          />
        </View>
      </View>
    );
  }
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputContainer: {
    flex: 1,

    // TODO: Adjust this once you've got mutations working as expected.
    // flexDirection: 'row',
  },
});

export default AddActivityInput;
