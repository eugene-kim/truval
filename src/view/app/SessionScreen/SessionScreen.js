import React, { Component } from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {View, Text} from 'styled-x';
import styled from 'styled-components';
import { Dimensions } from 'react-native';

import { getGqlParamString } from 'src/graphql/util';

// Selectors
import {
  getEntityById,
  getSessionActivityInstances,
} from 'src/redux/selectors/entitySelectors';

import { getAddActivityModalState } from 'src/redux/selectors/appSelectors';


// Containers
import { connect } from 'react-redux'
import GqlClientContainer from 'src/view/containers/GqlClientContainer';

// Components
import SessionHeader from './components/SessionHeader';
import AddActivityModal from './components/AddActivityModal';
import ActiveActivityView from './components/ActiveActivityView';
import PastActivitiesView from './components/PastActivitiesView';
import NavBar from '../NavBar';
import LinearGradient from 'react-native-linear-gradient';

// Styles
import Colors from 'src/view/styles/colors';


@GqlClientContainer(props => {
  const { sessionId } = props.navigation.state.params;
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
          totalDuration,
          sessionId,
          activityTypeId,
          activityType {
            id
            name,
            activityCount,
            categoryId,
            category {
              id
              name
              color
              iconFontFamily
              iconName
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

    const {queryIsLoading} = props;
    const {sessionId} = props.navigation.state.params;

    if (queryIsLoading) {
      console.log('query is loading...');
      return {}
    }

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
      isAddActivityModalOpen: getAddActivityModalState(state),
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

    isAddActivityModalOpen: PropTypes.bool,
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
      navigation,
      isAddActivityModalOpen,
    } = this.props;
    const didLoad = !queryIsLoading && session;
    const {width} = Dimensions.get('window');

    if (!didLoad) {
      return (
        <Text>
          {'Loading...'}
        </Text>
      );
    }

    const Container = styled.View`
      flex: 1
      marginTop: 20
      position: relative
    `;
    const ContentContainer = styled.View`
      flex: 1
    `;
    const HeaderContainer = styled.View`
      height: 35px
    `;
    const CurrentActivityContainer = styled.View`
      shadow-opacity: 0.50;
      shadow-radius: 5px;
      shadow-color: ${Colors.shadows.darkGray};
      shadow-offset: 0px 3px;
      zIndex: 1
    `;
    const PastActivitiesContainer = styled.View`
      flex: 1
      zIndex: 0
    `;
    const ModalContainer = styled.View`
      flex: 1
      position: absolute
      bottom: 0
      height: 100%
      paddingTop: 35
      width: ${width}
    `;
    const NavBarContainer = styled(LinearGradient)`
      flexGrow: 1
      position: absolute
      zIndex: 1
      bottom: 0
      width: ${width}
    `;

    return (
      <Container>
        <ContentContainer>
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
          <PastActivitiesContainer>
            <PastActivitiesView
              activityInstances={activityInstances}
            />
          </PastActivitiesContainer>
        </ContentContainer>
          {
            isAddActivityModalOpen ?
            (
              <ModalContainer>
                <AddActivityModal />
              </ModalContainer>
            ) : null
          }
        <NavBarContainer
          colors={[
            'rgba(255, 255, 255, 0.0)',
            'rgba(255, 255, 255, 0.9)',
            'rgba(255, 255, 255, 1.0)',
          ]}
          locations={[0, 0.5, 1.0]}>
          <NavBar />
        </NavBarContainer>
      </Container>
    );
  }
};


export default SessionScreen;
