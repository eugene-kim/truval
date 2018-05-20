import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

import AddNewActivityForm from './components/AddNewActivityForm';
import AddPreviousActivitiesList from './components/AddPreviousActivitiesList';


const AddActivityModal = ({session}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const Container = styled.View`
    flex: 1
    backgroundColor: ${Colors.whiteGray}
    paddingTop: 35
    borderTopLeftRadius: 27
    borderTopRightRadius: 27
  `;

  const NewActivityContainer = styled.View`
    paddingHorizontal: 17
  `;

  const HeaderText = styled.Text`
    ${TextStyles.display1()}
    marginBottom: 15
  `;
  const NewActivityHeader = HeaderText.extend``;

  const PreviousActivitiesHeader = HeaderText.extend``;

  const PreviousActivitiesContainer = styled.View`
    flex: 1
    marginTop: 35
    paddingLeft: 17
  `;


  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <NewActivityContainer>
        <NewActivityHeader>
          {'New'}
        </NewActivityHeader>
        <AddNewActivityForm />
      </NewActivityContainer>
      <PreviousActivitiesContainer>
        <PreviousActivitiesHeader>
          {'Previous'}
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
