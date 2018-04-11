import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';


const Circle = props => {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------  

  const {size, color} = props;

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View`
    height: ${size}
    width: ${size}
    borderRadius: ${size / 2}
    backgroundColor: ${color}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container {...props} >
      {props.children}
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
Circle.propTypes = {
  size: PropTypes.number.isRequired,
}


export default styled(Circle)``;