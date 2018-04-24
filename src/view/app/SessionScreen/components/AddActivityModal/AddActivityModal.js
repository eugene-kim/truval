import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';

const AddActivityModal = ({}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const Container = styled.View`
    flex: 1
    backgroundColor: red
    borderTopLeftRadius: 27
    borderTopRightRadius: 27
  `;

  const Message = styled.Text`
    color: black
    fontFamily: Nunito
    fontSize: 12
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <Message>{'I\'m a modal'}</Message>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddActivityModal.propTypes = {

}


export default AddActivityModal;
