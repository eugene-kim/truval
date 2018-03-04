import sinon from 'sinon';
import { createStore } from 'redux';
import root from 'redux/reducers/root';
import {
  createActivityInstance,
  updateActivityInstance,
  deleteActivityInstance,
} from 'redux/actions/entities/activityInstance';
import client from 'graphql/client';


describe('test activityInstance entity actions:', () => {
  set('store', () => createStore(root));
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

      console.log(spy.args[0]);
      console.log(spy.args[1]);
    });
  });
});