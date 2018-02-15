import React, {Component} from 'react';
import PropTypes from 'view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements';


const ActivityCategoryInput = ({onCategoryChange, activityCategory}) => {
  return (
    <View style={styles.container}>
      <FormInput
        onChange={onCategoryChange}
        keyboardType={'default'}
        value={activityCategory}
        style={styles.input}
      />
    </View>
  );
};

ActivityCategoryInput.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  activityCategory: PropTypes.string.isRequired,
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


export default ActivityCategoryInput;
