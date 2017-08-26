import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';


class ActivitySubmitButton extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {onSubmit} = this.props;

    return (
      <TouchableHighlight
        onPress={onSubmit}>
        <View>
          <Text>
            {'Submit'}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
});


export default ActivitySubmitButton;
