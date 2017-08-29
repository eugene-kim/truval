import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';


class ActivityTimeInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onTimeChange: PropTypes.func.isRequired,
    activityStartTime: PropTypes.string.isRequired,
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {onTimeChange, activityStartTime} = this.props;

    return (
      <View style={styles.container}>
        <TextInput
          onChange={onTimeChange}
          keyboardType={'default'}
          value={activityStartTime}
          style={styles.input}
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
    alignItems: 'center',

    // Why do I have to do this for the placeholder?
    justifyContent: 'center',

    // TEST
    borderWidth: 1,
    borderColor: 'black',
  },

  input: {
    // This gives the input size, which allows us to interact with the element.
    flex: 1,
  }
});


export default ActivityTimeInput;
