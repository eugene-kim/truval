import { createStore } from 'redux';
import focusApp from './reducers';
import {
  addUser,
  editUser,
  deleteUser,
  addSession,
  editSession,
  deleteSession,
  addActivity,
  editActivity,
  deleteActivity,
  addCategory,
  editCategory,
  deleteCategory,
} from './actions/actions';


let store = createStore(focusApp);

const unsubscribe = store.subscribe(() => {
  console.log('current state');
  console.log(store.getState());
});

store.dispatch(addUser({
  id: 1,
  name: 'Huge',
  email: 'eugene@gmail.com',
  password: 'eugene',
}));

store.dispatch(addSession({
  id: 1,
  name: 'Study sess'
}));

// store.dispatch(editUser(1, {
//   name: 'Hugeneeeee',
// }));

unsubscribe();