import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {FormInput} from 'react-native-elements';


class ActivityTimeInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onTimeChange: PropTypes.func.isRequired,
    start: PropTypes.string.isRequired,
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {onTimeChange, start} = this.props;

    return (
      <View style={styles.container}>
        <FormInput
          onChange={onTimeChange}
          keyboardType={'default'}
          value={start}
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
    alignItems: 'center',

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
