import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

const ActivityNameTextInput = props => {
  
  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  const {
    setFieldValue,
    fieldValue,
    fieldName,
    errorMessage,
    ...otherProps
  } = props;

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const Container = styled.View`
    position: relative
    marginBottom: 20
  `;

  const ActivityNameInput = styled.TextInput`
    height: 44
    borderRadius: 3
    borderWidth: 1
    borderColor: ${Colors.lightGray}
  `;

  const ErrorText = styled.Text`
    ${TextStyles.small(Colors.lightRed)}
    position: absolute
    bottom: -18
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <ActivityNameInput
        name={'activityName'}
        onChangeText={text => setFieldValue('activityName', text)}
        value={fieldValue}
      />
      { errorMessage && <ErrorText>{errorMessage}</ErrorText> }
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
ActivityNameTextInput.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  fieldValue: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
}


export default ActivityNameTextInput;
