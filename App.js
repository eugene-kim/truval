import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


import TrackDayScreen from './src/View/TrackActivity/TrackDayScreen';


// TODO: Insert reducer here.
let store = createStore();

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
