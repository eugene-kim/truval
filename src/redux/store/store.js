import { createStore } from 'redux';
import focusApp from '../reducers';
import {userActions, sessionActions, activityActions, categoryActions} from '../actions';
import initialState from './initialState';


let store = createStore(focusApp, initialState);

const unsubscribe = store.subscribe(() => {

  // `JSON.stringify()` works great for debugging since our
  // state doesn't contain any functions or circular references.
  console.log(JSON.stringify(store.getState(), null, 2));
});

unsubscribe();