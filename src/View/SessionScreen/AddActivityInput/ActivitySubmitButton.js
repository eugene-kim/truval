import React from 'react';
import PropTypes from 'prop-types';
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


export default ActivitySubmitButton;
