import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';
import {FlatList} from 'react-native';

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
import ActivityTypeListItem from './ActivityTypeListItem';

const AddPreviousActivitiesList = ({session, activityTypes, liveActivityInstance}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const List = styled.FlatList`
    paddingRight: 17
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <List
      data={activityTypes}
      renderItem={
        ({item, index}) => (
          <GqlClientContext.Consumer>
            {
              gqlClient => (
                <ActivityTypeListItem
                  liveActivityInstance={liveActivityInstance}
                  activityType={item}
                  session={session}
                  gqlClient={gqlClient}
                  isFirst={index === 0}
                  isLast={index === activityTypes.length - 1}
                />
              )
            }
          </GqlClientContext.Consumer>
        )
      }
      keyExtractor={item => item.id}
    />
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddPreviousActivitiesList.propTypes = {
  activityTypes: PropTypes.arrayOf(PropTypes.activityType),
  session: PropTypes.session,
  liveActivityInstance: PropTypes.activityInstance,
};


export default connect(

  // mapStateToProps
  state => {
    const activityTypeEntities = getActivityTypeEntities(state);

    // TODO: Return an array that's ordered by most frequently used / most recently used.
    const activityTypes = Object.keys(activityTypeEntities).map(
      activityTypeEntityId => activityTypeEntities[activityTypeEntityId]
    );

    return { activityTypes };
  }
)(AddPreviousActivitiesList);