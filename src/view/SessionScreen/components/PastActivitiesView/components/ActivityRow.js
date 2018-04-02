import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {Dimensions, Text, TextInput, View} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux'

// Redux
import {getEntityById} from 'src/redux/reducers/selectors/entitySelectors';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import CategoryCircle from './CategoryCircle';
import ActivityInfo from './ActivityInfo';


const ActivityRow = ({category, activityType, activityInstance}) => {
  const {start} = activityInstance;
  const {name} = activityType;

  const Container = styled.View`
    marginBottom: 35
    height: 60px
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
    height: 60
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
            {start}
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