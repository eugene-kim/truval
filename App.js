import React, {Component} from 'react'; 
import TrackDayScreen from './src/View/TrackActivity/SessionScreen';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

class FocusApp extends Component {
  render() {
    return (
  		<ApolloProvider client={client}>
        <TrackDayScreen />
      </ApolloProvider>
    );
  }
};


export default FocusApp;
