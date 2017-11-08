import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import { Button } from 'react-native-elements';


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
      <Button
        raised
        onPress={this.handleSubmit}
        title='Add Activity'
      />
    );
  }
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
});


export default ActivitySubmitButton;
