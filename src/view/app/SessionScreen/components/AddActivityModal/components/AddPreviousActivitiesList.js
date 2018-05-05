import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

import { GqlClientContext } from 'src/view/context/GqlClientContext';

// Redux
import { connect } from 'react-redux'
import {
  getActivityTypeEntities,
  getEntityById,
} from 'src/redux/selectors/entitySelectors';
import { getLiveActivityInstanceId } from 'src/redux/selectors/appSelectors';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import ActivityTypePill from './ActivityTypePill';

const AddPreviousActivitiesList = ({session, activityTypes, liveActivityInstance}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  
  const Container = styled.View`
    flex: 1
    flexDirection: row
    flexWrap: wrap
    overflow: scroll
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  const activityPills = activityTypes.map(activityType => (
    <GqlClientContext.Consumer
      key={activityType.id}>
      {
        gqlClient => (
          <ActivityTypePill
            liveActivityInstance={liveActivityInstance}
            activityType={activityType}
            session={session}
            gqlClient={gqlClient}
          />
        )
      }
    </GqlClientContext.Consumer>
  ));

  return (
    <Container>
      {activityPills}
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddPreviousActivitiesList.propTypes = {
  activityTypes: PropTypes.array,
  session: PropTypes.object,
};


export default connect(

  // mapStateToProps
  state => {
    const activityTypeEntities = getActivityTypeEntities(state);

    // TODO: Return an array that's ordered by most frequently used / most recently used.
    const activityTypes = Object.keys(activityTypeEntities).map(
      activityTypeEntityId => activityTypeEntities[activityTypeEntityId]
    );
    const liveActivityInstanceId = getLiveActivityInstanceId(state);
    const liveActivityInstance = getEntityById({
      id: liveActivityInstanceId,
      entityType: 'activityInstance',
      state,
    });

    return {
      activityTypes,
      liveActivityInstance,
    }
  })(AddPreviousActivitiesList);