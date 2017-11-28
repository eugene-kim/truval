import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import _ from 'lodash';

import ActivityRow from './ActivityRow';


const ActivityList = ({activities}) => 
  activities.map((activity, index) =>
    <ActivityRow
      name={activity.name}
      category={activity.category}
      time={activity.startTime}
      key={index}
    />
  );

// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
});


export default ActivityList;
