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
  const Container = View.extend`
    flex: 1
    backgroundColor: red
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <Text>{'I\'m a modal'}</Text>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddActivityModal.propTypes = {

}


export default AddActivityModal;
