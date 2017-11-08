import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements';


class ActivityNameInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onNameChange: PropTypes.func.isRequired,
    activityName: PropTypes.string.isRequired,
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {onNameChange, activityName} = this.props;
    return (
      <View style={styles.container}>
        <FormInput
          onChange={onNameChange}
          value={activityName}
          keyboardType={'default'}
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

    borderWidth: 1,
    borderColor: 'black',
  },

  input: {
    // This gives the input size, which allows us to interact with the element.
    flex: 1,
  },
});


export default ActivityNameInput;
