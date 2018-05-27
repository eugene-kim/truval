import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

import AddNewActivityForm from './components/AddNewActivityForm';
import AddPreviousActivitiesList from './components/AddPreviousActivitiesList';

import { GqlClientContext } from 'src/view/context/GqlClientContext';


const AddActivityModal = ({session, liveActivityInstance}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const Container = styled.View`
    flex: 1
    backgroundColor: ${Colors.whiteGray}
    paddingTop: 14
    borderTopLeftRadius: 27
    borderTopRightRadius: 27
    paddingHorizontal: 20
  `;

  const NewActivityContainer = styled.View`
  `;

  const NewActivityHeader = styled.Text`
    ${TextStyles.display1()}
    marginBottom: 5
  `;

  const PreviousActivitiesHeader = styled.Text`
    ${TextStyles.display1()}
    marginBottom: 5
  `;

  const PreviousActivitiesContainer = styled.View`
    flex: 1
    marginTop: 20
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
        <GqlClientContext.Consumer>
          {
            gqlClient => (
              <AddNewActivityForm
                gqlClient={gqlClient}
                session={session}
                liveActivityInstance={liveActivityInstance}
              />
            )
          }
        </GqlClientContext.Consumer>
      </NewActivityContainer>
      <PreviousActivitiesContainer>
        <PreviousActivitiesHeader>
          {'Add Previous'}
        </PreviousActivitiesHeader>
        <AddPreviousActivitiesList
          session={session}
          liveActivityInstance={liveActivityInstance}
        />
      </PreviousActivitiesContainer>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddActivityModal.propTypes = {
  liveActivityInstance: PropTypes.activityInstance,
}


export default AddActivityModal;
