import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import root from 'redux/reducers/root';
import {
  createActivityInstance,
  updateActivityInstance,
  deleteActivityInstance,
} from 'redux/actions/entities/activityInstance';
import client from 'graphql/client';
import initialState from '../initialState';


describe('test activityInstance entity actions:', () => {
  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(thunk),
  ));
  set('storeSpy', () => sinon.spy(store, 'dispatch'));
  set('newActivityInstanceNewType', () => ({
    name: 'asdf',
    categoryId: 'asdf',
    start: 'asdf',
  }));

  describe('CREATE_ACTIVITY_INSTANCE_REQUEST', () => {
    it('CREATE_ACTIVITY_INSTANCE_REQUEST was dispatched', () => {
      set('client', () => client({store}));

      store.dispatch(createActivityInstance(newActivityInstanceNewType, client));

      console.log(storeSpy.args[0]);
      console.log(storeSpy.args[1]);
    });
  });
});