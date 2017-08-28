import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';


class ActivityTimeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {

      // TODO: This should be the current time.
      value: '1:00AM',
    };
  }

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {

  }

  // --------------------------------------------------
  // Callbacks
  // --------------------------------------------------
  handleChange = (event) => {
    const value = event.nativeEvent.text;

    console.log(`handleChange is executing with the updated value: ${value}`);

    this.setState({value});
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChange={this.handleChange}
          keyboardType={'default'}
          value={this.state.value}
          placeholder={'Time of task'}
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
