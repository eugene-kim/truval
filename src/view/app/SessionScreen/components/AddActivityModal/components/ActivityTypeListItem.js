import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';
import {TouchableHighlight} from 'react-native';

// Util
import { getCurrentISOString, getDuration } from 'src/libs/util/Datetime';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Redux
import { connect } from 'react-redux'
import { getEntityById } from 'src/redux/selectors/entitySelectors';
import {
  createActivityInstance,
  updateActivityInstance,
} from 'src/redux/actions/entities/activityInstance';
import { closeAddActivityModal } from 'src/redux/actions/app/screenState';

// Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Circle from 'src/view/components/Circle';


const ActivityTypeListItem = ({
  handlePress,
  liveActivityInstance,
  activityType,
  category,
  session,
  gqlClient,
  isFirst,
  isLast,
}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const Container = styled.TouchableHighlight`
  `;

  const Content = styled.View`
    flexDirection: row
    alignItems: center
    justifyContent: flex-start
    paddingVertical: 10
    paddingHorizontal: 17
    borderBottomWidth: ${isLast ? 0 : 2}
    borderBottomColor: ${Colors.mediumGray}
  `;

  const CategoryIcon = styled(Icon)`
    marginRight: 15
  `;

  const FillerCircle = styled(Circle)`
    marginRight: 21
    marginLeft: 6
  `;

  const ActivityTypeName = styled.Text`
    flex: 1
    ${TextStyles.copy4()}
  `;

  const CategoryName = styled.Text`
    ${TextStyles.copy2(category.color)}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  const renderIcon = category => {
    const { iconName, color } = category;

    return iconName ? (
      <CategoryIcon
        name={iconName}
        size={25}
        color={color}
      />
    ) : (
      <FillerCircle
        size={12}
        color={color}
      />
    );
  }

  return (
    <Container onPress={handlePress}>
      <Content>
        {renderIcon(category)}
        <ActivityTypeName>
          {activityType.name}
        </ActivityTypeName>
        <CategoryName>
          {category.name}
        </CategoryName>
      </Content>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
ActivityTypeListItem.propTypes = {
  liveActivityInstance: PropTypes.activityInstance.isRequired,
  activityType: PropTypes.activityType.isRequired,
  category: PropTypes.category.isRequired,
  session: PropTypes.session.isRequired,
  gqlClient: PropTypes.gqlClient.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
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
        const endDatetimeString = getCurrentISOString();
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
            userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
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
)(ActivityTypeListItem);
