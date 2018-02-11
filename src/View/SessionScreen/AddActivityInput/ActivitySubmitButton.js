import React from 'react';
import PropTypes from 'view/util/PropTypes';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import { Button } from 'react-native-elements';


const ActivitySubmitButton = ({onSubmit}) => {
  return (
    <Button
      raised
      onPress={onSubmit}
      title='Add Activity'
    />
  );
}


ActivitySubmitButton.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
}


export default ActivitySubmitButton;
