import React, {Component} from 'react';
import styled from "styled-components";
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';


import { getGqlParamString } from 'src/graphql/util';

class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
    this.load();
  }

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    PropTypes.navigation.isRequired,
  }

  // --------------------------------------------------
  // Lifecycle / Setup
  // --------------------------------------------------
  load = () => {
    setTimeout(() => {
      this.props.navigation.navigate('SessionScreen', {
        sessionId: '997a5210-33d1-4198-a4a4-5f1ea477cc01',
      });

      console.log('Navigating to SessionScreen');
    }, 5000);
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


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  const Container = View.extend`
    flex: 1
    backgroundColor: gray
  `;

  render() {
    <View>
      <Text>
        {'Loading...'}
      </Text>
    </View>
  }
};


export default AuthLoadingScreen;
