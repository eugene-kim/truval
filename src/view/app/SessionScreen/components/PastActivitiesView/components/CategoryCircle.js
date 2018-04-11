import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'react-native';
import _ from 'src/libs/dash';

// Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


// Styles
import Colors from 'src/view/styles/colors';


const CategoryCircle = ({category}) => {
  const {color, name} = category;

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Render Functions
  // --------------------------------------------------
  const renderIcon = category => {
    const {iconName, name} = category;

    if (!category.iconName) {
      const letter = _.toUpper(name.charAt(0));

      return (
        <Letter>
          {letter}
        </Letter>
      )
    }

    return (
      <Icon
        name={iconName}
        size={20}
        color={Colors.white}
      />
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Circle>
      <Content>
        {renderIcon(category)}
      </Content>
    </Circle>
  );
}

CategoryCircle.propTypes = {
  category: PropTypes.object.isRequired,
}


export default CategoryCircle;
