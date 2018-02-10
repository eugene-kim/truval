// Module Imports
import React, {Component} from 'react'; 
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Local Imports
import SessionScreen from './src/view/SessionScreen/SessionScreen';
import getGqlClient from './src/graphql/client';
import rootReducer from './src/redux/reducers/root';
import initialState from './src/redux/store/initialState';


const gqlClient = getGqlClient();
const store = createStore(rootReducer, initialState);

class FocusApp extends Component {
  static childContextTypes = {

    // TODO: Create a proper proptype
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