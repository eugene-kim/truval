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
    backgroundColor: ${Colors.whiteGray}
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
    paddingTop: 35
    paddingHorizontal: 17
  `;

  const PreviousActivitiesHeader = styled.Text`
    ${TextStyles.display1()}
    marginBottom: 15
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
