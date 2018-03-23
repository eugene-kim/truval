import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, View} from 'react-native';

// Util
import Datetime from 'src/libs/util/Datetime';
import bind from 'src/libs/decorators/bind';

// Components
import ActivityTimeInput from './ActivityTimeInput';
import ActivityCategoryInput from './ActivityCategoryInput';
import ActivityNameInput from './ActivityNameInput';
import ActivitySubmitButton from './ActivitySubmitButton';


class AddActivityInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start: new Datetime().toString(),
      category: '',
      name: '',
    };
  }

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    sessionId: PropTypes.uuid.isRequired,
  };

  static contextTypes = {
    gqlClient: PropTypes.gqlClient,
    userId: PropTypes.uuid.isRequired,
  }

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

    datetime.isNewMinute() && this.setState({start: datetime.toString()});
  }

  extractValueFromEvent(event) {
    return event.nativeEvent.text;
  }

  // --------------------------------------------------
  // Callbacks
  // --------------------------------------------------

  @bind
  handleTimeChange(event) {
    const start = this.extractValueFromEvent(event);

    this.setState({start});
  }

  @bind
  handleCategoryChange(event) {
    const category = this.extractValueFromEvent(event);

    this.setState({category});
  }

  @bind
  handleNameChange(event) {
    const name = this.extractValueFromEvent(event);

    this.setState({name});
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {gqlClient, userId} = this.context;
    const {sessionId} = this.props;
    const {start, category, name} = this.state;

    // Sample input value for now
    const activityInstance = {start, categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7', name, sessionId, userId};

    // Not rendering the submit button for now
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ActivityTimeInput
            onTimeChange={this.handleTimeChange}
            start={start}
            style={styles.timeInput}
          />
          <ActivityNameInput
            onNameChange={this.handleNameChange}
            name={name}
            style={styles.nameInput}
          />
          <ActivityCategoryInput
            onCategoryChange={this.handleCategoryChange}
            category={category}
            style={styles.categoryInput}
          />
        </View>
        <ActivitySubmitButton
          gqlClient={gqlClient}
          activityInstance={activityInstance}
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
