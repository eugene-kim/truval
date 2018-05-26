import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import styled from 'styled-components';
import {Text, TextInput, View} from 'styled-x';
import {Dimensions, ScrollView, FlatList} from 'react-native';
import _ from 'src/libs/dash';

import ActivityRow from './ActivityRow';


const ActivityList = ({activityInstances}) => {

  // TODO: Figure out the proper way to style this flat list.
  const StyledList = styled.FlatList`
    width: ${Dimensions.get('window').width}
  `;

  return (
    <StyledList
      data={activityInstances}
      renderItem={
        ({item, index}) => (
          <ActivityRow
            isFirst={index === 0}
            activityInstance={item}
          />
        )
      }
      keyExtractor={item => item.id}
    />
  );
}

ActivityList.propTypes = {
  activityInstances: PropTypes.arrayOf(PropTypes.activityInstance).isRequired,
}


export default ActivityList;