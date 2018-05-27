import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';


const AddActivityFormErrors = ({errors, style}) => {

  const errorTypes = Object.keys(errors);

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View``;
  const ErrorMessage = styled.Text`
    ${TextStyles.copy3(Colors.lightRed)}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  
  return errorTypes.length === 0 ? null : (
    <Container style={style}>
      {errorTypes.map((errorTypes, index) => (
        <ErrorMessage key={index}>{`- ${errors[errorTypes]}`}</ErrorMessage>
      ))}
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddActivityFormErrors.propTypes = {
  errors: PropTypes.object.isRequired,
  style: PropTypes.style,
}


export default AddActivityFormErrors;
