import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'react-native';
import _ from 'src/libs/dash';

// Styles
import Colors from 'src/view/styles/colors';

const CategoryCircle = ({category}) => {
  const {color, name} = category;
  const Circle = styled.View`
    height: 50px
    width: 50px
    borderRadius: 25px
    backgroundColor: ${color}
  `;
  const Content = styled.View`
    flex: 1
    justifyContent: center
    alignItems: center
  `;
  const Letter = styled.Text`
    fontSize: 14
    color: ${Colors.text.white}
  `;

  const letter = _.toUpper(name.charAt(0));

  return (
    <Circle>
      <Content>
        <Letter>
          {letter}
        </Letter>
      </Content>
    </Circle>
  );
}

CategoryCircle.propTypes = {
  category: PropTypes.object.isRequired,
}


export default CategoryCircle;
