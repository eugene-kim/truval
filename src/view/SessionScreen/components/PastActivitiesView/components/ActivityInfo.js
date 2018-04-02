import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';

const ActivityInfo = ({activityInstance, activityType}) => {
  const {name} = activityType;
  const {duration} = activityInstance;

  const Container = styled.View`
    height: 34px
  `;
  const Content = styled.View`
    flex: 1
    justifyContent: flex-start
    alignItems: flex-start
  `;
  const Name = styled.Text`
    fontFamily: Nunito-Bold
    fontSize: 15
    color: ${Colors.text.darkGray}
  `;
  const DurationContainer = styled.View`
    flex: 1
    flexDirection: row
    justifyContent: flex-start
  `;
  const InstanceDuration = styled.Text`
    fontFamily: Nunito
    fontSize: 12
    color: ${Colors.text.darkGray}
    marginRight: 4
  `;
  const TypeDuration = styled.Text`
    fontFamily: Nunito-Italic
    fontSize: 12
    color: ${Colors.text.lightGray}
  `;
  const totalDurationText = `Total ${duration}`;

  return (
    <Container>
      <Content>
        <Name>
          {name}
        </Name>
        <DurationContainer>
          <InstanceDuration>
            {duration}
          </InstanceDuration>
          <TypeDuration>
            {totalDurationText}
          </TypeDuration>
        </DurationContainer>
      </Content>
    </Container>
  );
}

ActivityInfo.propTypes = {
  activityInstance: PropTypes.object.isRequired,
  activityType: PropTypes.object.isRequired,
}


export default ActivityInfo;
