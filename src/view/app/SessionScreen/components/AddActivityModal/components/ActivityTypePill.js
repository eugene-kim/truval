import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {TouchableHighlight} from 'react-native';
import {Text, TextInput, View} from 'styled-x';

// Redux
import { connect } from 'react-redux'
import {
  createActivityInstance,
  updateActivityInstance,
} from 'src/redux/actions/entities/activityInstance';
import { closeAddActivityModal } from 'src/redux/actions/app/screenState';
import { getEntityById } from 'src/redux/selectors/entitySelectors';

// Util
import { getDuration } from 'src/libs/util/Datetime';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivityTypePill = ({activityType, category, handlePress}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const {color} = category;

  const Container = styled(TouchableHighlight)`
  `;
  const Content = styled.View`
    flexDirection: row
    alignItems: center
    justifyContent: center
    paddingVertical: 10
    paddingHorizontal: 20
    marginRight: 7
    marginBottom: 10
    backgroundColor: ${color}
    borderRadius: 100
  `;
  const ActivityTypeText = styled.View`
    flex: 1
    flexDirection: column
    justifyContent: center
    alignItems: flex-start
  `;
  const ActivityTypeName = styled.Text`
    ${TextStyles.mediumBold(Colors.text.white)}
  `;
  const CategoryIcon = styled(Icon)`
    marginRight: 10
  `;
  const CategoryName = styled.Text`
    ${TextStyles.extraSmall(Colors.text.white)}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  const renderIcon = category => {
    const {iconName, name} = category;

    if (!iconName) {
      return null;
    }

    return (
      <CategoryIcon
        name={iconName}
        size={25}
        color={Colors.white}
      />
    );
  }

  return (
    <Container onPress={handlePress}>
      <Content> 
        {renderIcon(category)}
        <ActivityTypeText>
          <ActivityTypeName>
            {activityType.name}
          </ActivityTypeName>
          <CategoryName>
            {category.name.toUpperCase()}
          </CategoryName>
        </ActivityTypeText> 
      </Content>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
ActivityTypePill.propTypes = {
  activityType: PropTypes.activityType.isRequired,
  category: PropTypes.category.isRequired,
  handlePress: PropTypes.func.isRequired,
}


export default connect(

  // mapStateToProps
  (state, props) => {
    const {activityType} = props;
    const {categoryId} = activityType;
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
      categoryId,
      liveActivityInstance,
    } = props;

    const {start} = liveActivityInstance;

    return {
      handlePress: () => {
        const endDatetime = new Date();
        const endDatetimeString = endDatetime.toISOString();
        const duration = getDuration(start, endDatetimeString);

        // Update currently running instance with an `end` time.
        const updateActivityInstanceAction = updateActivityInstance({
          id: liveActivityInstance.id,
          propsToUpdate: {
            end: endDatetimeString,
            duration,
            isComplete: true,
          },
          client: gqlClient,
        });

        // Create a new activityInstance - sets the new currentActivity
        const createActivityInstanceAction = createActivityInstance({
          activityInstance: {
            isComplete: false,
            name: activityType.name,
            sessionId: session.id,
            start: endDatetimeString,
            activityTypeId: activityType.id,
            categoryId,
          },
          client: gqlClient,
        });

        const closeAddActivityModalAction = closeAddActivityModal();

        dispatch(updateActivityInstanceAction);
        dispatch(createActivityInstanceAction);
        dispatch(closeAddActivityModalAction);
      },
    }
  }
)(ActivityTypePill);
