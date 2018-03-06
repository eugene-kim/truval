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

  // I'm not able to run set() on this for some reason.
  let spy;

  beforeEach(() => {
    spy = sinon.spy(store, 'dispatch');
  });

  afterEach(() => {
    store.dispatch.restore();
  });

  describe('createActivityInstance', () => {
    set('activityInstance', () => ({
      name: 'asdf',
      categoryId: 'asdf',
      start: 'asdf',
    }));

    /**
     * An action suffixed by `_REQUEST` will be tested independently since they're called at the
     * beginning of the thunk and followed by other actions which change the store state and make
     * it awkward to test for state RIGHT after the `_REQUEST` action was called.
     */
    describe(`${CREATE_ACTIVITY_INSTANCE_REQUEST}`, () => {

      it('was dispatched', async () => {
        const expectedAction = {
          type: CREATE_ACTIVITY_INSTANCE_REQUEST,
          payload: {activityInstance},
        }

        store.dispatch(createActivityInstanceRequest(activityInstance, client));

        const resultAction = spy.getCall(0).args[0];

        expect(resultAction).toEqual(expectedAction);
      });

      it(`set the new fetchStatus to '${LOADING}'`, () => {
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