import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {FormLabel, FormInput} from 'react-native-elements';


class ActivityCategoryInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    onCategoryChange: PropTypes.func.isRequired,
    activityCategory: PropTypes.string.isRequired,
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {onCategoryChange, activityCategory} = this.props;

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
  }
};

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
