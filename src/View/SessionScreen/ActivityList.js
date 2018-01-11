import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import _ from 'lodash';

import ActivityRow from './ActivityRow';


const ActivityList = ({isLoading, activities}) => {
  return _.map(activities, activity => {
    const {id, name, start, isComplete, categoryId} = activity;

    return (
      <ActivityRow
        key={id}
        name={name}
        time={start}
        category={categoryId}
      />
    );
  });
}


export default ActivityList;