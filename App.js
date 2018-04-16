// Module Imports
import React, { Component } from 'react';
import { SwitchNavigator, StackNavigator } from 'react-navigation';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';

// Local Imports

import AuthLoadingScreen from 'src/view/app/AuthLoadingScreen';
import SessionScreen from 'src/view/app/SessionScreen';
import AddActivityModal from 'src/view/app/AddActivityModal';
import getGqlClient from 'src/graphql/client';
import rootReducer from 'src/redux/reducers/root';
import initialState from 'src/redux/store/initialState';
import PropTypes from 'src/view/util/PropTypes'

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    logger,
    thunk,
  ),
);

class TruvalApp extends Component {
  constructor(props) {
    super(props);

    this.client = getGqlClient({store});
  }

  static childContextTypes = {
    gqlClient: PropTypes.gqlClient,

    // TODO: Remove when we implement authentication.
    userId: PropTypes.uuid,
  }

  getChildContext() {
    return {
      gqlClient: this.client,

      // TODO: Remove when we implement authentication.
      userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
    };
  }

  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
};
const AppStack = StackNavigator(
  {
    SessionScreen: {
      screen: SessionScreen,
    },
    AddActivityModal: {
      screen: AddActivityModal,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const RootStack = StackNavigator(

  // RouteConfigs
  {
    AuthLoading: {
      screen: AuthLoadingScreen,
    },
    AppStack: {
      screen: AppStack,
    },
  },

  // StackNavigatorConfig
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
  },
);




export default TruvalApp;