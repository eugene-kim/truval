import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
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

import {
  CREATE_ACTIVITY_INSTANCE_REQUEST,
  CREATE_ACTIVITY_INSTANCE_SUCCESS,
  UPDATE_ACTIVITY_INSTANCE_REQUEST,
  UPDATE_ACTIVITY_INSTANCE_SUCCESS,
  UPDATE_ACTIVITY_INSTANCE_FAILURE,
  DELETE_ACTIVITY_INSTANCE_REQUEST,
  DELETE_ACTIVITY_INSTANCE_SUCCESS,
  DELETE_ACTIVITY_INSTANCE_FAILURE,
  ADD_ACTIVITY_TYPE
} from 'redux/actions/types';


// Resources
import activityTypeInstanceNormalized from '../resources/activityTypeInstanceNormalized';


describe('activityInstance entity actions:', () => {
  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('mockStore', () => configureStore(middleware)(initialState));
  set('client', () => client({store}));
  set('mutate', () => jest.fn(() => activityTypeInstanceNormalized));

  describe('createActivityInstance', () => {

    set('activityInstance', () => ({
      name: 'Write seed data',
      categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
      start: '2017-10-20T17:00:00.000-07:00',
    }));

    set('createActivityInstanceRequestAction', () => ({
      type: CREATE_ACTIVITY_INSTANCE_REQUEST,
      payload: {activityInstance},
    }));

    /**
     * An action suffixed by `_REQUEST` will be tested independently since it's called at the
     * beginning of the thunk and followed by other actions which change the store state and make
     * it awkward to validate for state RIGHT after the `_REQUEST` action was called.
     */
    describe(`${CREATE_ACTIVITY_INSTANCE_REQUEST}`, () => {

      it('was dispatched', async () => {

        mockStore.dispatch(createActivityInstanceRequest(activityInstance, client));

        const resultAction = mockStore.getActions()[0];

        expect(resultAction).toEqual(createActivityInstanceRequestAction);
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

    describe('successful request', () => {
      it(`expected actions were dispatched`, async () => {

        // Set client mutate to mocked function.
        client.mutate = mutate;

        await mockStore.dispatch(createActivityInstance(activityInstance, client));

        const actions = mockStore.getActions();

        // There isn't much value in testing what the payload of the action is. In our tests we
        // simply need to verify that
        // 1. the expected actions were dispatched and
        // 2. the state was updated as expected.
        const dispatchedActionTypes = actions.map(action => action.type);

        expect(dispatchedActionTypes).toEqual([
          CREATE_ACTIVITY_INSTANCE_REQUEST,
          ADD_ACTIVITY_TYPE,
          CREATE_ACTIVITY_INSTANCE_SUCCESS,
        ]);
      });
    });
  });
});