import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import styled from 'styled-components';
import {View, Text} from 'react-native';
import { connect } from 'react-redux'

// Containers
import GraphQLContainer from '../containers/GraphQLContainer';

import {getGqlParamString} from 'src/graphql/util';

// Selectors
import {
  getEntityById,
  getSessionActivityInstances,
} from 'src/redux/reducers/selectors/entitySelectors';

// Components
import SessionHeader from './components/SessionHeader';
import ActiveActivityView from './components/ActiveActivityView';
import SessionPastActivities from './components/SessionPastActivities';

// Styles
import Colors from 'src/view/styles/colors';

// Naive implementation.
// TODO: Add ability to pass props into this.
@GraphQLContainer(props => {
  const {sessionId} = props;
  const params = getGqlParamString({id: sessionId});

  return (
    `query {
      session(${params}) {
        id,
        name,
        start,
        end,
        isComplete,
        activityInstances {
          id,
          start,
          end,
          isComplete,
          duration,
          sessionId,
          activityTypeId,
          activityType {
            id
            name,
            activityCount,
            categoryId,
            category {
              id,
              name
              color
            }
          }
        }
      }
    }`
  );
})
@connect(

  // mapStateToProps
  (state, props) => {
    const {sessionId} = props;

    // Add methods to redux
    const activeActivityInstanceId = 'c72cea78-2027-4615-a6a1-3daca28c9bba';

    // TODO: Create a model or a selector so that this kind of retrieval is easy
    const activeActivityInstance = getEntityById({
      id: activeActivityInstanceId,
      entityType: 'activityInstance',
      state,
    });
    const {activityTypeId} = activeActivityInstance;
    const activeActivityType = getEntityById({
      id: activityTypeId,
      entityType: 'activityType',
      state,
    });
    const {categoryId} = activeActivityType;
    const activeCategory = getEntityById({
      id: categoryId,
      entityType: 'category',
      state,
    });

    return {
      session: getEntityById({id: sessionId, entityType: 'session', state}),
      activityInstances: getSessionActivityInstances({state, sessionId}),
      activeActivityInstance,
      activeActivityType,
      activeCategory,
    }
  },
)
class SessionScreen extends Component {

  static propTypes = {

    // Not sure if I should make this required when it might not be
    // available on screen load.
    session: PropTypes.object,
    activeActivityInstance: PropTypes.object,
    activeActivityType: PropTypes.object,
    activeCategory: PropTypes.object,

    // TODO: Use a proper proptype later
    activityInstances: PropTypes.array,
    queryIsLoading: PropTypes.bool.isRequired,
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {
      queryIsLoading,
      session,
      activityInstances,
      activeActivityInstance,
      activeCategory,
      activeActivityType,
    } = this.props;
    const didLoad = !queryIsLoading && session;

    if (!didLoad) {
      return (
        <Text>
          {'Loading...'}
        </Text>
      );
    }

    const Container = styled.View`
      flex: 1

      /* 
        Height of the iOS status bar.

        TODO: Make this dynamic to accomodate Android as well.
      */
      marginTop: 40
    `;
    const HeaderContainer = styled.View`
      height: 30px
    `;
    const CurrentActivityContainer = styled.View`
      height: 200px

      shadow-opacity: 0.50;
      shadow-radius: 5px;
      shadow-color: ${Colors.shadows.darkGray};
      shadow-offset: 0px 3px;
    `;

    return (
      <Container>
        <HeaderContainer>
          <SessionHeader
            session={session}
            activityInstance={activeActivityInstance}
            category={activeCategory}
          />
        </HeaderContainer>
        <CurrentActivityContainer>
          <ActiveActivityView
            activityType={activeActivityType}
            activityInstance={activeActivityInstance}
            category={activeCategory}
          />
        </CurrentActivityContainer>
      </Container>
    );
  }
};


export default SessionScreen;
