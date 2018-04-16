import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';

// Using the react-native component until this issue is resolved:
// https://github.com/lelandrichardson/react-primitives/issues/71.
import {TouchableHighlight} from 'react-native';
import {Text, TextInput, View} from 'styled-x';


// Styles
import Colors from 'src/view/styles/colors';
import { getCircleStyle } from 'src/view/styles/views';

// Components
// import Circle from 'src/view/components/Circle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const NavAddButton = ({ navigation }) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const buttonSize = 60;

  const Container = styled(TouchableHighlight)`
    ${getCircleStyle(buttonSize)}
    backgroundColor: ${Colors.primary}
    justifyContent: center
    alignItems: center
    shadow-opacity: 0.50;
    shadow-radius: 2px;
    shadow-color: ${Colors.shadows.darkGray};
    shadow-offset: 0px 4px;
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container
      onPress={() => navigation.navigate('AddActivityModal')}>
      <Icon
        name={'plus'}
        size={30}
        color={Colors.white}
      />
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
NavAddButton.propTypes = {
}


export default NavAddButton;
