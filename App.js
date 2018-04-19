// Module Imports
import React, { Component } from 'react';
import {View, Text} from 'styled-x';
import PropTypes from 'src/view/util/PropTypes'
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { GqlClientContext } from 'src/view/context/GqlClientContext';
import getGqlClient from 'src/graphql/client';
import rootReducer from 'src/redux/reducers/root';
import initialState from 'src/redux/store/initialState';
import TruvalStack from 'src/view/app/TruvalNavStack';


const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    logger,
    thunk,
  ),
);
const gqlClient = getGqlClient({store});


class TruvalApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GqlClientContext.Provider value={gqlClient}>
        <Provider store={store}>
          <TruvalStack />
        </Provider>
      </GqlClientContext.Provider>
    );
  }
};


export default TruvalApp;