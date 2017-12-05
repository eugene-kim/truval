import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Datetime from 'library/util/Datetime';

// Components
import ActivityTimeInput from './ActivityTimeInput';
import ActivityCategoryInput from './ActivityCategoryInput';
import ActivityNameInput from './ActivityNameInput';
import ActivitySubmitButton from './ActivitySubmitButton';


const CREATE_ACTIVITY = gql`
  mutation createActivity(
    $sessionId: ID!,
    $activityName: String!,
    $activityStart: String!,
    $activityCategory: ID!,
  ) {
    createActivity(
      name:$activityName,
      start:$activityStart,
      categoryId:$activityCategory,
      sessionId: $sessionId,
    ) {
      name, start, categoryId
    }
  }
`;

@graphql(CREATE_ACTIVITY, {
  props: ({mutate}) => ({

    // Generates a submit handler based on the provided activity.
    // TODO: This should fire off another mutaiton that completes currently running event.
    generateOnSubmit: (newActivity = {}) => () => { 
      const {name, start, categoryId, sessionId} = newActivity;

      mutate({
        variables: {
          ...newActivity,
        },
        optimisticResponse: {
          createActivity: {
            name,
            start,
            categoryId,
            sessionId,
          },
        },
        // update: (proxy, {data: { createActivity }}) => {
          
        // },
      });
    },
  }),
  options: {
    update: (proxy, {data: {}}) => {

    },
  },
})
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
    generateOnSubmit: PropTypes.func.isRequired,
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

  extractValueFromEvent = event => event.nativeEvent.text

  // --------------------------------------------------
  // Callbacks
  // --------------------------------------------------

  // TODO: Make newTime a datetime object instead of a String.
  handleTimeChange = event => {
    const activityStartTime = this.extractValueFromEvent(event);

    this.setState({activityStartTime});
  }

  handleCategoryChange = event => {
    const activityCategory = this.extractValueFromEvent(event);

    this.setState({activityCategory});
  }

  handleNameChange = event => {
    const activityName = this.extractValueFromEvent(event);

    this.setState({activityName});
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {generateOnSubmit, sessionId} = this.props;
    const {activityStartTime, activityCategory, activityName} = this.state;
    const newActivity = {
      sessionId,
      activityCategory,
      activityName,
      activityStart: activityStartTime,
    };
    const onSubmit = generateOnSubmit(newActivity);

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
        <ActivitySubmitButton
          onSubmit={onSubmit}
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
    flex: 1,
  },

  inputContainer: {
    flex: 1,

    // TODO: Adjust this once you've got mutations working as expected.
    // flexDirection: 'row',
  },
});

export default AddActivityInput;
