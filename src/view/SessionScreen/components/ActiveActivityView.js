import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'react-native';

import Colors from 'src/view/styles/colors';


const ActiveActivityView = ({activityType, activityInstance, category}) => {
  const Container = styled.View`
    flexGrow: 1
    justifyContent: center
    alignItems: center
    position: relative
    paddingVertical: 27
    backgroundColor: ${category.color}
  `;

  const CircleContainer = styled.View`
    height: 146px
    width: 146px
    borderRadius: 73px
    backgroundColor: ${Colors.white}
  `;

  const CircleContent = styled.View`
    flex: 1
    justifyContent: center
    alignItems: center
  `;

  const ActivityName = styled.Text`
    fontFamily: Nunito-SemiBold
    fontSize: 12
    color: ${Colors.text.darkGray}
  `;

  // Placeholder for now.
  const Timer = styled.Text`
    fontFamily: Nunito
    fontSize: 41
    color: ${Colors.text.darkGray}
  `;

  const Line = styled.View`
    width: 2px
    height: 30px
    backgroundColor: ${Colors.white}
    position: absolute
    bottom: 0px
  `;

  return (
    <Container>
      <CircleContainer>
        <CircleContent>
          <Timer>
            {`10:12`}
          </Timer>
          <ActivityName>
            {activityType.name}
          </ActivityName>
        </CircleContent>
      </CircleContainer>
      <Line />
    </Container>  
  );
}

ActiveActivityView.propTypes = {
  activityType: PropTypes.object.isRequired,
  activityInstance: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
}


export default ActiveActivityView;
