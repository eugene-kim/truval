import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';
import { Formik } from 'formik';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import NewActivitySubmitButton from './components/NewActivitySubmitButton';


const AddNewActivityForm = ({}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View`
    flex: 1
    flexBasis: auto
  `;

  const FormContainer = styled.View`
    flex: 1
    flexBasis: auto
    alignItems: stretch
  `;

  const ActivityNameInput = styled.TextInput`
    height: 44
    borderWidth: 1
    borderColor: ${Colors.lightGray}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <Formik
        initialValues={{'ActivityName': ''}}
        onSubmit={null}
        validateForm={null}
        validateOnBlur={false}
        render={formikProps => (
          <FormContainer>
            <ActivityNameInput
              name={'ActivityName'}
              onChangeText={text => formikProps.setFieldValue('ActivityName', text)}
              value={formikProps.values.email}
            />
            <NewActivitySubmitButton />
          </FormContainer>
        )}
      />
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddNewActivityForm.propTypes = {

}


export default AddNewActivityForm;
