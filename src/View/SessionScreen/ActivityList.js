import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import _ from 'src/libs/dash';

import ActivityRow from './ActivityRow';


const ActivityList = ({activityInstances}) => _.map(activityInstances, activityInstance => {
  return (
    <ActivityRow
      key={activityInstance.id}
      activityInstance={activityInstance}
    />
  );
});


export default ActivityList;