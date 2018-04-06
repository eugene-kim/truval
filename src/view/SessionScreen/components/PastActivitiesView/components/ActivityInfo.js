import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';

import {printDuration} from 'src/libs/util/Datetime';

const ActivityInfo = ({activityInstance, activityType}) => {
  const {name} = activityType;
  const {duration, totalDuration} = activityInstance;

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

  const renderTotalDuration = ({duration, totalDuration}) => {
    if (!totalDuration || totalDuration <= duration) {
      return null;
    }

    const totalDurationText = `Total: ${printDuration(totalDuration)}`;

    return (
      <TypeDuration>
        {totalDurationText}
      </TypeDuration>
    );
  }

  return (
    <Container>
      <Content>
        <Name>
          {name}
        </Name>
        <DurationContainer>
          <InstanceDuration>
            {printDuration(duration)}
          </InstanceDuration>
          {renderTotalDuration({duration, totalDuration})}
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
