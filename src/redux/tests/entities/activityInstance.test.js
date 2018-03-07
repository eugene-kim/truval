import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import root from 'redux/reducers/root';
import {
  getNewActivityInstanceFetchStatus,
  getActivityInstanceFetchStatus,
  getActivityInstanceEntities,
  getEntityByName,
} from 'redux/reducers/selectors';
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


describe('activityInstance entity actions:', () => {
  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('prevState', () => store.getState());

  // Matching activityType exists
  set('normalizedCreateActivityInstanceResponse', () => ({
    "entities": {
      "activityType": {
        "1982f070-704c-4054-beb4-ea188399fc10": {
          "id": "1982f070-704c-4054-beb4-ea188399fc10",
          "name": "Write seed data",
          "activityCount": 7,
          "categoryId": "ca05ca36-805c-4f67-a097-a45988ba82d7"
        }
      },
      "activityInstance": {
        "cbd0c73a-f877-4ffb-8e7f-736dcd72b5da": {
          "id": "cbd0c73a-f877-4ffb-8e7f-736dcd72b5da",
          "isComplete": false,
          "start": "2017-10-20T17:00:00.000-07:00",
          "end": null,
          "activityType": "1982f070-704c-4054-beb4-ea188399fc10"
        }
      }
    },
    "result": {
      "data": {
        "createActivityInstance": "cbd0c73a-f877-4ffb-8e7f-736dcd72b5da"
      }
    }
  }));

  set('mockStore', () => configureStore(middleware)(initialState));
  set('gqlClient', () => client({store}));
  set('mutate', () => jest.fn(() => normalizedCreateActivityInstanceResponse));

  describe('createActivityInstance', () => {

    set('createActivityInstancePayload', () => ({
      name: 'Write seed data',
      categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
      start: '2017-10-20T17:00:00.000-07:00',
    }));

    set('createActivityInstanceRequestAction', () => ({
      type: CREATE_ACTIVITY_INSTANCE_REQUEST,
      payload: {activityInstance: createActivityInstancePayload},
    }));

    /**
     * An action suffixed by `_REQUEST` will be tested independently since it's called at the
     * beginning of the thunk and followed by other actions which change the store state and make
     * it awkward to validate for state RIGHT after the `_REQUEST` action was called.
     */
    describe(`${CREATE_ACTIVITY_INSTANCE_REQUEST}`, () => {

      it('was dispatched', async () => {
        mockStore.dispatch(createActivityInstanceRequest(createActivityInstancePayload, gqlClient));

        const resultAction = mockStore.getActions()[0];

        expect(resultAction).toEqual(createActivityInstanceRequestAction);
      });

      it(`set the new fetchStatus to '${LOADING}'`, () => {
        const prevFetchStatus = getNewActivityInstanceFetchStatus(prevState);

        store.dispatch(createActivityInstanceRequest(createActivityInstancePayload, gqlClient));

        const newState = store.getState();
        const newFetchStatus = getNewActivityInstanceFetchStatus(newState);

        expect(prevFetchStatus).not.toEqual(newFetchStatus);
        expect(newFetchStatus).toEqual(LOADING);
      });
    });

    describe('successful request', () => {
      it(`expected actions were dispatched`, async () => {

        // Set client mutate to mocked function.
        gqlClient.mutate = mutate;

        await mockStore.dispatch(createActivityInstance(createActivityInstancePayload, gqlClient));

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

      describe('updated state', () => {
        describe('when matching activityType exists', () => {
          it('activityType count was increased by 1', async () => {
            
            // Set client mutate to mocked function.
            gqlClient.mutate = mutate;

            const prevActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityTypeName: 'activityType',
              state: prevState,
            });
            const previousCount = prevActivityType.activityCount;

            await store.dispatch(createActivityInstance(createActivityInstancePayload, gqlClient));

            const newState = store.getState();
            const updatedActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityTypeName: 'activityType',
              state: newState,
            });
            const newCount = updatedActivityType.activityCount;

            expect(newCount).toEqual(previousCount + 1);
          });

          it('new activityInstance entity was created', async () => {

            // Set client mutate to mocked function.
            gqlClient.mutate = mutate;

            const prevActivityInstanceEntities = getActivityInstanceEntities(prevState);
            const prevFetchStatuses = getActivityInstanceFetchStatus(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstance(createActivityInstancePayload, gqlClient),
            });

            const id = getNewActivityInstanceId(mockStore);

            const newState = store.getState();
            const newActivityInstanceEntities = getActivityInstanceEntities(newState);

            expect(prevActivityInstanceEntities[id]).toBeUndefined();
            expect(newActivityInstanceEntities[id]).toBeDefined();
          });

          it(`fetch status for new activityInstance was created and set to ${LOADED}`, async () => {

            // Set client mutate to mocked function.
            gqlClient.mutate = mutate;

            const prevFetchStatuses = getActivityInstanceFetchStatus(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstance(createActivityInstancePayload, gqlClient),
            });

            const id = getNewActivityInstanceId(mockStore);

            const newState = store.getState();
            const newFetchStatuses = getActivityInstanceFetchStatus(newState);

            expect(prevFetchStatuses[id]).toBeUndefined();
            expect(newFetchStatuses[id]).toEqual(LOADED);
          });
        });

        // describe('when new activityType was created', () => {
        //   set('activityInstance', () => ({
        //     name: 'new activity type',
        //     categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
        //     start: '2017-10-20T17:00:00.000-07:00',
        //   }));

        //   // TODO: Update
        //   set('normalizedCreateActivityInstanceResponse', () => ({
        //     "entities": {
        //       "activityType": {
        //         "1982f070-704c-4054-beb4-ea188399fc10": {
        //           "id": "1982f070-704c-4054-beb4-ea188399fc10",
        //           "name": "Write seed data",
        //           "activityCount": 7,
        //           "categoryId": "ca05ca36-805c-4f67-a097-a45988ba82d7"
        //         }
        //       },
        //       "activityInstance": {
        //         "cbd0c73a-f877-4ffb-8e7f-736dcd72b5da": {
        //           "id": "cbd0c73a-f877-4ffb-8e7f-736dcd72b5da",
        //           "isComplete": false,
        //           "start": "2017-10-20T17:00:00.000-07:00",
        //           "end": null,
        //           "activityType": "1982f070-704c-4054-beb4-ea188399fc10"
        //         }
        //       }
        //     },
        //     "result": {
        //       "data": {
        //         "createActivityInstance": "cbd0c73a-f877-4ffb-8e7f-736dcd72b5da"
        //       }
        //     }
        //   }));
        // });
      });
    });
  });
});

const dispatch = ({store, mockStore, action}) => Promise.all([
  store.dispatch(action),
  mockStore.dispatch(action),
]);

const getNewActivityInstanceId = mockStore => {
  const actions = mockStore.getActions();
  const createActivityInstanceSuccessAction = actions[2];
  const {payload} = createActivityInstanceSuccessAction;
  const newActivityInstance = payload.activityInstance;
  
  return newActivityInstance.id;
}