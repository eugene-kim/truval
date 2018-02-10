// Module Imports
import React, {Component} from 'react'; 
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Local Imports
import SessionScreen from './src/view/SessionScreen/SessionScreen';
import getGqlClient from './src/graphql/client';
import rootReducer from './src/redux/reducers/root';


const gqlClient = getGqlClient();
const store = createStore(rootReducer);

class FocusApp extends Component {
  static childContextTypes = {
    gqlClient: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      gqlClient,
    };
  }

  render() {
    return (
      <Provider store={store}>
        <SessionScreen sessionId={1} />
      </Provider>
    );
  }
};


export default FocusApp;