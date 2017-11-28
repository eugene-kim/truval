import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from './src/redux/reducers';
import TrackDayScreen from './src/View/TrackActivity/SessionScreen';


let store = createStore(reducer);

class FocusApp extends Component {
  render() {
    return (
  		<Provider store={store}>
        <TrackDayScreen />
      </Provider>
    );
  }
};


export default FocusApp;
