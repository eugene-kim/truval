import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';


class ActivitySubmitButton extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    activity: PropTypes.object.isRequired,
  }

  // --------------------------------------------------
  // Callbacks
  // --------------------------------------------------
  handleSubmit = () => {
    const {onSubmit, activity} = this.props;

    onSubmit(activity);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <TouchableHighlight
        onPress={this.handleSubmit}>
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
