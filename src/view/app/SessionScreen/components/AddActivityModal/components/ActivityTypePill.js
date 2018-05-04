import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Redux
import { connect } from 'react-redux'
import {
  createActivityInstance,
  updateActivityInstance,
} from 'src/redux/actions/entities/activityInstance';
import { getEntityById } from 'src/redux/selectors/entitySelectors';

// Styles
import Colors from 'src/view/styles/colors';

const ActivityTypePill = ({activityType, category, handlePress}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return null;
}


// --------------------------------------------------
// Props
// --------------------------------------------------
ActivityTypePill.propTypes = {
}


export default connect(

  // mapStateToProps
  (state, props) => {
    const {categoryId} = props;
    const category = getEntityById({
      id: categoryId,
      entityType: 'category',
      state,
    });

    return { category };
  },

  // mapDispatchToProps
  (dispatch, props) => {
    const {
      gqlClient,
      activityType,
      session,
      liveActivityInstance,
    } = props;

    return {
      handlePress: () => {
        const datetime = new Datetime();
        const datetimeString = datetime.toString();

        // Update currently running instance with an `end` time.
        const updateActivityInstanceAction = updateActivityInstance({
          id: liveActivityInstance.id,

          // TODO: add duration
          propsToUpdate: {
            end: datetimeString,
            duration: 1200,
          },
          client: gqlClient,
        });

        dispatch(updateActivityInstanceAction);

        // Create a new activityInstance
        const createActivityInstanceAction = createActivityInstance({
          activityInstance: {
            
            isComplete: false,
            sessionId: session.id,
            activityTypeId: activityType.id,
            start: datetimeString,
          },
          client: gqlClient,
        });

        dispatch(createActivityInstanceAction);


        // Close the AddActivityModal

      },
    }
  }
)(ActivityTypePill);
