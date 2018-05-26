import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Redux
import { connect } from 'react-redux'
import { getEntityById } from 'src/redux/selectors/entitySelectors';

// Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Circle from 'src/view/components/Circle';


const ActivityTypeListItem = ({
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
  const Container = styled.View`
    flexDirection: row
    alignItems: center
    justifyContent: flex-start
    paddingHorizontal: 13
    paddingVertical: 16
    borderBottomWidth: ${isLast ? 0 : 1}
    borderBottomColor: ${Colors.mediumGray}
  `;

  const CategoryIcon = styled(Icon)`
    marginRight: 15
  `;

  const FillerCircle = styled(Circle)`
    marginRight: 15
  `;

  const ActivityTypeName = styled.Text`
    flex: 1
    ${TextStyles.copy3()}
  `;

  const CategoryName = styled.Text`
    ${TextStyles.copy1(category.color)}
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
    <Container>
      {renderIcon(category)}
      <ActivityTypeName>
        {activityType.name}
      </ActivityTypeName>
      <CategoryName>
        {category.name}
      </CategoryName>
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
  }
)(ActivityTypeListItem);
