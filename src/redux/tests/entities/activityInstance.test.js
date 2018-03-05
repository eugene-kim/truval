import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import root from 'redux/reducers/root';
import {
  createActivityInstance,
  updateActivityInstance,
  deleteActivityInstance,
} from 'redux/actions/entities/activityInstance';
import {CREATE_ACTIVITY_INSTANCE_REQUEST} from 'redux/actions/types';
import client from 'graphql/client';
import initialState from '../initialState';
import activityTypeInstanceNormalized from '../resources/activityTypeInstanceNormalized';


describe('activityInstance entity actions:', () => {
  const middlewares = [thunk];
  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middlewares),
  ));
  set('mockStore', () => configureStore(middlewares)(initialState));
  set('activityInstance', () => ({
    name: 'asdf',
    categoryId: 'asdf',
    start: 'asdf',
  }));
  set('client', () => client({store}));
  set('mutate', () => jest.fn(() => activityTypeInstanceNormalized));

  describe('CREATE_ACTIVITY_INSTANCE_REQUEST', () => {
    it('was dispatched', () => {

      // Set client mutate to mocked function.
      client.mutate = mutate;

      const createActivityInstanceAction = createActivityInstance(activityInstance, client);

      mockStore.dispatch(createActivityInstanceAction);

      const actions = mockStore.getActions();

      expect(actions[0].type).toEqual(CREATE_ACTIVITY_INSTANCE_REQUEST);
    });
  });
});