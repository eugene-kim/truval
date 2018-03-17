import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import _ from 'lodash';

import ActivityRow from './ActivityRow';


const ActivityList = ({isLoading, activities}) => {
  return _.map(activities, activity => {
    const {id, name, start, isComplete, category} = activity;
    const categoryId = parseInt(category);

    return (
      <ActivityRow
        key={id}
        name={name}
        start={start}
        category={categoryId}
      />
    );
  });
}


export default ActivityList;