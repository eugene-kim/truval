import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements';


const ActivityNameInput = ({onNameChange, name}) => {
  return (
    <View style={styles.container}>
      <FormInput
        onChange={onNameChange}
        value={name}
        keyboardType={'default'}
        style={styles.input}
      />
    </View>
  );
}

// --------------------------------------------------
// Props
// --------------------------------------------------
ActivityNameInput.propTypes = {
  onNameChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}


// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
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
