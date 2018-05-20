import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';

const ActivityNameTextInput = props => {
  
  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  const {
    setFieldValue,
    ...otherProps
  } = props;

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <TextInput
      name={'ActivityName'}
      onChangeText={setFieldValue}
      {...otherProps}
    />
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
ActivityNameTextInput.propTypes = {

}


export default ActivityNameTextInput;
