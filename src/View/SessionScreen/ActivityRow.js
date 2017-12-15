import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';


const ActivityRow = ({name, category, time}) => {
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

ActivityRow.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});


export default ActivityRow;