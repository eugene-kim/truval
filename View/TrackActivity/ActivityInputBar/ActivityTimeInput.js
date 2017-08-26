import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';


class ActivityTimeInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {

  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={'10:00am'}
          placeholder={'Time of task'}
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
});


export default ActivityTimeInput;
