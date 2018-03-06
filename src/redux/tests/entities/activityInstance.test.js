import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import root, {getNewActivityInstanceFetchStatus} from 'redux/reducers/root';
import client from 'graphql/client';
import initialState from '../initialState';

import {
  createActivityInstance,
  createActivityInstanceRequest,
  createActivityInstanceSuccess,
  createActivityInstanceFailure,
  updateActivityInstance,
  deleteActivityInstance,
} from 'redux/actions/entities/activityInstance';

import {
  UPDATING,
  LOADING,
  LOADED,
  FAILED,
  DELETING,
} from 'redux/reducers/fetchStatus';

import { CREATE_ACTIVITY_INSTANCE_REQUEST } from 'redux/actions/types';


// Resources
import activityTypeInstanceNormalized from '../resources/activityTypeInstanceNormalized';


describe('activityInstance entity actions:', () => {
  const middlewares = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middlewares),
  ));
  // set('mockStore', () => configureStore(middlewares)(initialState));
  set('client', () => client({store}));
  set('mutate', () => jest.fn(() => activityTypeInstanceNormalized));

  describe('createActivityInstance', () => {
    set('activityInstance', () => ({
      name: 'asdf',
      categoryId: 'asdf',
      start: 'asdf',
    }));

    describe(`${CREATE_ACTIVITY_INSTANCE_REQUEST}`, () => {

      it('was dispatched', async () => {

        // I'm not able to put this in a `set()` block for some reason.
        const spy = sinon.spy(store, 'dispatch');
        const expectedAction = {
          type: CREATE_ACTIVITY_INSTANCE_REQUEST,
          payload: {activityInstance},
        }

        store.dispatch(createActivityInstanceRequest(activityInstance, client));

        const resultAction = spy.getCall(0).args[0];

        expect(resultAction).toEqual(expectedAction);
      });

      it(`set the new fetchStatus to '${LOADING}'`, () => {
        // I'm not able to put this in a `set()` block for some reason.
        const spy = sinon.spy(store, 'dispatch');
        const oldState = store.getState();
        const oldFetchStatus = getNewActivityInstanceFetchStatus(oldState);

        store.dispatch(createActivityInstanceRequest(activityInstance, client));

        const newState = store.getState();
        const newFetchStatus = getNewActivityInstanceFetchStatus(newState);

        expect(oldFetchStatus).not.toEqual(newFetchStatus);
        expect(newFetchStatus).toEqual(LOADING);
      });
    });

    // describe('success', () => {
    //     // Set client mutate to mocked function.
    //     client.mutate = mutate;
    // });

    // describe('failure', () => {

    // });
  });
});