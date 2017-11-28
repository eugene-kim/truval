import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';

// Components
import AddActivityInput from './AddActivityInput/AddActivityInput';
import ActivityList from './ActivityList';


class SessionScreen extends Component {
  constructor(props) {
    super(props);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {activities} = this.state;

    return (
      <View style={styles.container}>
        <AddActivityInput
          onSubmit={this.handleSubmit}
        />
        <ActivityList
          activities={activities}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Height of iOS status bar
    marginTop: 40,
  },
});

export default SessionScreen;
