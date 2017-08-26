import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';


class ActivityRow extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,

    // TODO: Make this a Datetime object.
    time: PropTypes.string.isRequired,
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {name, category, time} = this.props;

    return (
      <View
        style={styles.container}>
        <Text style={styles.time}>
          {time}
        </Text>
        <Text style={styles.name}>
          {name}
        </Text>
        <Text style={styles.category}>
          {category}
        </Text>
      </View>
    );
  }

};

const styles = {
    container: {
      flexDirection: 'row',
    },
  };


export default ActivityRow;
