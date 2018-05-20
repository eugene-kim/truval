import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {Dimensions, Text, View} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux'
import { TextInput } from 'styled-x';

// Redux
import {getEntityById} from 'src/redux/selectors/entitySelectors';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import CategoryCircle from './CategoryCircle';
import ActivityInfo from './ActivityInfo';

// Util
import Datetime from 'src/libs/util/Datetime';


const ActivityRow = ({category, activityType, activityInstance, isFirst}) => {
  const {start} = activityInstance;
  const date = Datetime(start);
  const {name} = activityType;

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View`

    /*
      Hardcoded to match the size of the CategoryCircle because
      the rendering any more elements than VirtualizedList's initialNumToRender
      prop results in incorrect rendering of elements. They get squished and 
      don't play nicely with flex.
    */
    height: 50
    marginTop: ${isFirst ? 30 : 0}
    marginBottom: 35
  `;
  const Contents = styled.View`
    flex: 1
    flexDirection: row
    justifyContent: center
    alignItems: center
  `;
  const ContentContainer = styled.View`
    flex: 1
    flexDirection: row
    justifyContent: center
    alignItems: center
  `;
  const CircleContainer = ContentContainer.extend`
    flex: 0 1 auto
  `;
  const StartContainer = ContentContainer.extend`
    justifyContent: flex-end
    marginRight: 45
  `;
  const StartTime = styled.Text`
    fontFamily: Nunito-Bold
    fontSize: 12
    color: ${Colors.text.lightGray}
  `;
  const ActivityInfoContainer = ContentContainer.extend`
    justifyContent: flex-start
    marginLeft: 45
  `;

  return (
    <Container>
      <Contents>
        <StartContainer>
          <StartTime textAlign={'right'}>
            {date.getHoursAndMinutes()}
          </StartTime>
        </StartContainer>
        <CircleContainer>
          <CategoryCircle
            category={category}
          />
        </CircleContainer>
        <ActivityInfoContainer>
          <ActivityInfo
            activityInstance={activityInstance}
            activityType={activityType}
          />
        </ActivityInfoContainer>
      </Contents>
    </Container>
  );
}

ActivityRow.propTypes = {
  category: PropTypes.object.isRequired,
  activityType: PropTypes.object.isRequired,
  activityInstance: PropTypes.object.isRequired,
  isFirst: PropTypes.bool.isRequired,
};

export default connect(
  (state, props) => {
    const {activityInstance} = props;
    const {activityTypeId} = activityInstance;
    const activityType = getEntityById({id: activityTypeId, entityType: 'activityType', state});
    const {categoryId} = activityType;
    const category = getEntityById({id: categoryId, entityType: 'category', state});

    return {
      category,
      activityType,
    }
  }
)(ActivityRow);