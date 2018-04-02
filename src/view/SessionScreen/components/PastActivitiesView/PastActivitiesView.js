import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import ActivityList from './components/ActivityList';


const PastActivitiesView = ({activityInstances}) => {
  const Container = styled.View`
    flex: 1
    flexDirection: column
    position: relative
    justifyContent: center
    alignItems: center
    backgroundColor: ${Colors.white}
  `;

  const Line = styled.View`
    height: 100%
    width: 2px
    backgroundColor: ${Colors.mediumGray}
    position: absolute
  `;

  return (
    <Container>
      <Line />
      <ActivityList
        activityInstances={activityInstances}
      />
    </Container>
  );
}

PastActivitiesView.propTypes = {
  activityInstances: PropTypes.array.isRequired,
}


export default PastActivitiesView;
