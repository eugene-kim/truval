import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const NavGraphIcon = ({}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Icon
      name={'account'}
      size={30}
      color={Colors.mediumGray}
    />
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
NavGraphIcon.propTypes = {
}


export default NavGraphIcon;
