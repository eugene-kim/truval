// Module Imports
import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';

// Local Imports
import SessionScreen from './src/view/SessionScreen/SessionScreen';
import getGqlClient from './src/graphql/client';
import rootReducer from './src/redux/reducers/root';
import initialState from './src/redux/store/initialState';
import PropTypes from './src/view/util/PropTypes'

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    logger,
    thunk,
  ),
);

class FocusApp extends Component {
  constructor(props) {
    super(props);

    this.client = getGqlClient({store});
    this.state = {
      isLoading: true,
      didError: false,
    };
  }

  static childContextTypes = {
    gqlClient: PropTypes.gqlClient,
  }

  componentDidMount() {
    // TODO: Retrieve current user id via authentication and hydrate store.
    // Hardcoded for now until we add user authentication. Retrieve from store later.
    const userId = 1;

    // Make query to store so that the store is hydrated with all entity data on App start.
    const initialAppQuery = `
      query {
        user(id:${userId}) {
          id,
          username,
          email,
          sessions {
            id,
            name,
            start,
            end,
            isComplete,
            activities {
              id,
              name,
              start,
              end,
              isComplete,
              duration,
              category {
                id,
              }
            }
          },
          categories {
            id,
            name,
            color,
            isPrimary
          }
        }
      }
    `;

    this.client.query(initialAppQuery)
    .then(response => {
      console.log(store === this.client.getStore());

      this.setState({isLoading: false});

      console.log('Got response from server for initial query.');
    })
    .catch(error => {
      this.setState({
        isLoading: false,
        didError: true,
      });

      console.log('Initial query errored out!');
    });
  }

  getChildContext() {
    return {
      gqlClient: this.client,
    };
  }

  render() {
    const {isLoading, didError} = this.state;

    if (didError) {
      return (
        <View>
          <Text>Error!</Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <Provider store={store}>
        <SessionScreen sessionId={1} />
      </Provider>
    );
  }
};


export default FocusApp;