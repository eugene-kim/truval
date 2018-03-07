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
  getActivityTypeEntities,
  getActivityTypeFetchStatus,
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
  set('mutate', () => () => normalizedCreateActivityInstanceResponse);

  beforeEach(() => gqlClient.mutate = mutate);

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
        set('createActivityInstanceThunk', () => createActivityInstance(createActivityInstancePayload, gqlClient));

        describe('when matching activityType exists', () => {
          it(`the matching activityType's activityCount was increased by 1`, async () => {
            const prevActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityTypeName: 'activityType',
              state: prevState,
            });
            const previousCount = prevActivityType.activityCount;

            await store.dispatch(createActivityInstanceThunk);

            const newState = store.getState();
            const updatedActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityTypeName: 'activityType',
              state: newState,
            });
            const newCount = updatedActivityType.activityCount;

            expect(newCount).toEqual(previousCount + 1);
          });

          it('a new activityInstance entity was created', async () => {
            const prevActivityInstanceEntities = getActivityInstanceEntities(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstanceThunk,
            });

            const id = getNewEntityId({
              mockStore,
              actionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
              entityName: 'activityInstance',
            });

            const newState = store.getState();
            const newActivityInstanceEntities = getActivityInstanceEntities(newState);

            expect(prevActivityInstanceEntities[id]).toBeUndefined();
            expect(newActivityInstanceEntities[id]).toBeDefined();
          });

          it(`a new fetch status for new activityInstance was created and set to '${LOADED}'`, async () => {
            const prevFetchStatuses = getActivityInstanceFetchStatus(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstanceThunk,
            });

            const id = getNewEntityId({
              mockStore,
              actionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
              entityName: 'activityInstance',
            });

            const newState = store.getState();
            const newFetchStatuses = getActivityInstanceFetchStatus(newState);

            expect(prevFetchStatuses[id]).toBeUndefined();
            expect(newFetchStatuses[id]).toEqual(LOADED);
          });

          it(`activityInstance new fetch status was set to '${LOADED}'`, async () => {
            const prevNewActivityInstanceStatus = getNewActivityInstanceFetchStatus(prevState);

            await store.dispatch(createActivityInstanceThunk);

            const newState = store.getState();
            const updatedNewActivityInstanceStatus = getNewActivityInstanceFetchStatus(newState);

            expect(prevNewActivityInstanceStatus).not.toEqual(LOADED);
            expect(updatedNewActivityInstanceStatus).toEqual(LOADED);
          });
        });

        describe('when an activityType with a matching name DNE', () => {
          set('createActivityInstancePayload', () => ({
            name: 'new activity type',
            categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
            start: '2017-10-20T17:00:00.000-07:00',
          }));

          set('normalizedCreateActivityInstanceResponse', () => ({
            "entities": {
              "activityType": {
                "585915a7-3e84-4308-bf95-bd17447658d0": {
                  "id": "585915a7-3e84-4308-bf95-bd17447658d0",
                  "name": "new activity type",
                  "activityCount": 1,
                  "categoryId": "ca05ca36-805c-4f67-a097-a45988ba82d7"
                }
              },
              "activityInstance": {
                "88897f60-b378-4895-a098-0c336a75268d": {
                  "id": "88897f60-b378-4895-a098-0c336a75268d",
                  "isComplete": false,
                  "start": "2017-10-20T17:00:00.000-07:00",
                  "end": null,
                  "activityType": "585915a7-3e84-4308-bf95-bd17447658d0"
                }
              }
            },
            "result": {
              "data": {
                "createActivityInstance": "88897f60-b378-4895-a098-0c336a75268d"
              }
            }
          }));

          it(`activityInstance new fetch status was set to '${LOADED}'`, async () => {
            const prevNewActivityInstanceStatus = getNewActivityInstanceFetchStatus(prevState);

            await store.dispatch(createActivityInstanceThunk);

            const newState = store.getState();
            const updatedNewActivityInstanceStatus = getNewActivityInstanceFetchStatus(newState);

            expect(prevNewActivityInstanceStatus).not.toEqual(LOADED);
            expect(updatedNewActivityInstanceStatus).toEqual(LOADED);
          });

          it('a new activityType entity was created', async () => {
            const prevActivityTypeEntities = getActivityTypeEntities(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstanceThunk,
            });

            const newState = store.getState();
            const id = getNewEntityId({
              mockStore,
              actionType: ADD_ACTIVITY_TYPE,
              entityName: 'activityType',
            });

            const newActivityTypeEntities = getActivityTypeEntities(newState);
            const activityType = newActivityTypeEntities[id];

            expect(activityType).toBeDefined();
            expect(prevActivityTypeEntities[id]).toBeUndefined();
          });

          it(`a new activityType fetchStatus was created and set to '${LOADED}'`, async () => {
            const prevActivityTypeFetchStatuses = getActivityTypeFetchStatus(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstanceThunk,
            });

            const newState = store.getState();
            const id = getNewEntityId({
              mockStore,
              actionType: ADD_ACTIVITY_TYPE,
              entityName: 'activityType',
            });

            const newActivityTypeFetchStatuses = getActivityTypeFetchStatus(newState);
            const fetchStatus = newActivityTypeFetchStatuses[id];

            expect(fetchStatus).toEqual(LOADED);
            expect(prevActivityTypeFetchStatuses[id]).toBeUndefined();
          });

          it('a new activityInstance entity was created', async () => {
            const prevActivityInstanceEntities = getActivityInstanceEntities(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstanceThunk,
            });

            const id = getNewEntityId({
              mockStore,
              actionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
              entityName: 'activityInstance',
            });

            const newState = store.getState();
            const newActivityInstanceEntities = getActivityInstanceEntities(newState);

            expect(prevActivityInstanceEntities[id]).toBeUndefined();
            expect(newActivityInstanceEntities[id]).toBeDefined();
          });

          it(`a new fetch status for new activityInstance was created and set to '${LOADED}'`, async () => {
            const prevFetchStatuses = getActivityInstanceFetchStatus(prevState);

            await dispatch({
              store,
              mockStore,
              action: createActivityInstanceThunk,
            });

            const id = getNewEntityId({
              mockStore,
              actionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
              entityName: 'activityInstance',
            });

            const newState = store.getState();
            const newFetchStatuses = getActivityInstanceFetchStatus(newState);

            expect(prevFetchStatuses[id]).toBeUndefined();
            expect(newFetchStatuses[id]).toEqual(LOADED);
          });
        });
      });
    });

    // describe('failed attempt', () => {
    //   set('mutate', () => throw new Error('Error creating activityInstance'));


    // });
  });
});

const dispatch = ({store, mockStore, action}) => Promise.all([
  store.dispatch(action),
  mockStore.dispatch(action),
]);

const getNewEntityId = ({mockStore, actionType, entityName}) => {
  const actions = mockStore.getActions();
  const action = actions.find(action => action.type === actionType);
  const {payload} = action;
  const entity = payload[entityName];

  return entity.id;
}