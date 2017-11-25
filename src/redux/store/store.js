
import { createStore } from 'redux';
import focusApp from '../reducers';
import {
  addUser, editUser, deleteUser,
  addSession, editSession, deleteSession,
  addActivity, editActivity, deleteActivity,
  addCategory, editCategory, deleteCategory,
} from '../actions/actions';
import initialState from './initialState';


console.log('initialState', initialState);
let store = createStore(focusApp, initialState);

const unsubscribe = store.subscribe(() => {

  // JSON.stringify works great for debugging since our
  // state doesn't contain any functions or circular references.
  console.log(JSON.stringify(store.getState(), null, 2));
});

unsubscribe();