import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import Circle from 'src/view/components/Circle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const AddButton = ({}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const BgCircle = Circle.extend`
    justifyContent: center
    alignItems: center
    shadow-radius: 8px;
    shadow-color: ${Colors.shadows.darkGray};
    shadow-offset: 0px 4px;
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <BgCircle
      size={60}
      color={Colors.primary}>
      <Icon
        name={'plus'}
        size={30}
        color={Colors.white}
      />
    </BgCircle>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddButton.propTypes = {
}


export default AddButton;
