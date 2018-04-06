// Module Imports
import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';

// Local Imports
import { getGqlParamString } from 'src/graphql/util';
import SessionScreen from 'src/view/SessionScreen';
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
    this.state = {
      queryIsLoading: true,
      queryFailed: false,
    };
  }

  static childContextTypes = {
    gqlClient: PropTypes.gqlClient,

    // TODO: Remove when we implement authentication.
    userId: PropTypes.uuid,
  }

  componentDidMount() {

    // TODO: Retrieve current user id via authentication and hydrate store.
    // Hardcoded for now until we add user authentication. Retrieve from store later.
    const userId = 'cb39dbb5-caa8-4323-93a5-13450b875887';
    const params = getGqlParamString({id: userId});

    // Make query to store so that the store is hydrated with all entity data on App start.
    const initialAppQuery = `
      query {
        user(${params}) {
          id,
          username,
          email,
          sessions {
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
              activityTypeId
            }
          },
          activityTypes {
            id
            name
            activityCount
            category {
              id,
            }
          }
          categories {
            id,
            name,
            color,
            iconFontFamily,
            iconName,
            isPrimary
          }
        }
      }
    `;

    this.client.query(initialAppQuery)
    .then(response => {
      console.log(store === this.client.getStore());

      this.setState({queryIsLoading: false});

      console.log('Got response from server for initial query.');
    })
    .catch(error => {
      this.setState({
        queryIsLoading: false,
        queryFailed: true,
      });

      console.log(error.stack);
      console.log('Initial query errored out!');
    });
  }

  getChildContext() {
    return {
      gqlClient: this.client,

      // TODO: Remove when we implement authentication.
      userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
    };
  }

  render() {
    const {queryIsLoading, queryFailed} = this.state;

    if (queryFailed) {
      return (
        <View>
          <Text>Error!</Text>
        </View>
      );
    }

    if (queryIsLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <Provider store={store}>
        <SessionScreen sessionId={'997a5210-33d1-4198-a4a4-5f1ea477cc01'} />
      </Provider>
    );
  }
};


export default TruvalApp;