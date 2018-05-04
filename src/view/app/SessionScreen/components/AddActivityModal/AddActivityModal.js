import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

import AddPreviousActivitiesList from './components/AddPreviousActivitiesList';


const AddActivityModal = ({session}) => {

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

  const PreviousActivitiesContainer = styled.View`
    flex: 1
  `;

  const PreviousActivitiesHeader = styled.Text`
    ${TextStyles.largeBoldHeader}
    color: ${Colors.text.darkGray}
  `;



  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <PreviousActivitiesContainer>
        <PreviousActivitiesHeader>
          {'Add Previous'}
        </PreviousActivitiesHeader>
        <AddPreviousActivitiesList
          session={session}
        />
      </PreviousActivitiesContainer>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddActivityModal.propTypes = {

}


export default AddActivityModal;
