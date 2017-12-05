import React, {Component} from 'react'; 
import SessionScreen from 'src/View/SessionScreen/SessionScreen';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
  link: new HttpLink({uri: 'http://localhost:3000/graphql'}),
  cache: new InMemoryCache(),
});

class FocusApp extends Component {
  render() {
    return (
  		<ApolloProvider client={client}>
        <SessionScreen sessionId={1} />
      </ApolloProvider>
    );
  }
};


export default FocusApp;