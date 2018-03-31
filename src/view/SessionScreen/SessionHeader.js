import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';


const SessionHeader = ({session, activityInstance, category}) => {
  debugger

  const {name} = session;
  const Container = styled.View`
    height: 30px;
    opacity: .70;
    backgroundColor: ${() => category.color};
  `;
  const SessionName = styled.Text`
    
  `;`

  return (
    <Container>
    </Container>
  );
}

SessionHeader.propTypes = {
  session: PropTypes.object.isRequired,
  activityInstance: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
}


export default SessionHeader;
