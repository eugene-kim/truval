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
  getEntities,
  getEntityByName,
  getEntityById,
  getEntityFetchStatuses,
  getEntityFetchStatus,
  getNewEntityFetchStatus,
} from 'redux/reducers/selectors';
import client from 'graphql/client';
import initialState from '../initialState';

import {
  createActivityInstance,
  createActivityInstanceRequest,
  createActivityInstanceSuccess,
  createActivityInstanceFailure,
  updateActivityInstance,
  updateActivityInstanceRequest,
  deleteActivityInstance,
  deleteActivityInstanceRequest,
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
  CREATE_ACTIVITY_INSTANCE_FAILURE,
  UPDATE_ACTIVITY_INSTANCE_REQUEST,
  UPDATE_ACTIVITY_INSTANCE_SUCCESS,
  UPDATE_ACTIVITY_INSTANCE_FAILURE,
  DELETE_ACTIVITY_INSTANCE_REQUEST,
  DELETE_ACTIVITY_INSTANCE_SUCCESS,
  DELETE_ACTIVITY_INSTANCE_FAILURE,
  ADD_ACTIVITY_TYPE,
  UPDATE_ACTIVITY_TYPE_SUCCESS,
} from 'redux/actions/types';


describe('activityInstance entity actions:', () => {
  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('prevState', () => store.getState());
  set('mockStore', () => configureStore(middleware)(initialState));
  set('gqlClient', () => client({store}));

  describe('createActivityInstance', () => {

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

    set('mutate', () => () => normalizedCreateActivityInstanceResponse);

    beforeEach(() => gqlClient.mutate = mutate);

    set('createActivityInstancePayload', () => ({
      name: 'Write seed data',
      categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
      start: '2017-10-20T17:00:00.000-07:00',
    }));

    set('createActivityInstanceThunk', () => createActivityInstance(createActivityInstancePayload, gqlClient));

    /**
     * An action suffixed by `_REQUEST` will be tested independently since it's called at the
     * beginning of the thunk and followed by other actions which change the store state and make
     * it awkward to validate for state RIGHT after the `_REQUEST` action was called.
     */
    describe(`${CREATE_ACTIVITY_INSTANCE_REQUEST}`, () => {

      set('createActivityInstanceRequestAction', () => ({
        type: CREATE_ACTIVITY_INSTANCE_REQUEST,
        payload: {activityInstance: createActivityInstancePayload},
      }));

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

    describe('successful activityInstance creation', () => {
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
        describe('when matching activityType exists', () => {
          it(`activityInstance new fetch status was set to '${LOADED}'`, async () => {
            const prevNewActivityInstanceStatus = getNewActivityInstanceFetchStatus(prevState);

            await store.dispatch(createActivityInstanceThunk);

            const newState = store.getState();
            const updatedNewActivityInstanceStatus = getNewActivityInstanceFetchStatus(newState);

            expect(prevNewActivityInstanceStatus).not.toEqual(LOADED);
            expect(updatedNewActivityInstanceStatus).toEqual(LOADED);
          });

          it(`the matching activityType's activityCount was increased by 1`, async () => {
            const prevActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityType: 'activityType',
              state: prevState,
            });
            const previousCount = prevActivityType.activityCount;

            await store.dispatch(createActivityInstanceThunk);

            const newState = store.getState();
            const updatedActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityType: 'activityType',
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
              entityType: 'activityInstance',
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
              entityType: 'activityInstance',
            });

            const newState = store.getState();
            const newFetchStatuses = getActivityInstanceFetchStatus(newState);

            expect(prevFetchStatuses[id]).toBeUndefined();
            expect(newFetchStatuses[id]).toEqual(LOADED);
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
              entityType: 'activityType',
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
              entityType: 'activityType',
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
              entityType: 'activityInstance',
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
              entityType: 'activityInstance',
            });

            const newState = store.getState();
            const newFetchStatuses = getActivityInstanceFetchStatus(newState);

            expect(prevFetchStatuses[id]).toBeUndefined();
            expect(newFetchStatuses[id]).toEqual(LOADED);
          });
        });
      });
    });

    describe('failed activityInstance creation', () => {
      beforeEach(() => gqlClient.mutate = () => {
        throw new Error('Error creating activityInstance');
      });

      it('expected actions were dispatched', async () => {
        await mockStore.dispatch(createActivityInstanceThunk);

        const expectedActionTypes = [
          CREATE_ACTIVITY_INSTANCE_REQUEST,
          CREATE_ACTIVITY_INSTANCE_FAILURE,
        ];

        const actions = mockStore.getActions();
        const actionTypes = actions.map(action => action.type);

        expect(actionTypes).toEqual(expectedActionTypes);
      });

      describe('matching activityType exists', () => {
        it(`the new activityInstance fetch status is set to ${FAILED}`, async () => {
          const prevNewActivityInstanceFetchStatus = getNewActivityInstanceFetchStatus(prevState);

          await store.dispatch(createActivityInstanceThunk);

          const newState = store.getState();
          const newActivityInstanceFetchStatus = getNewActivityInstanceFetchStatus(newState);

          expect(newActivityInstanceFetchStatus).toEqual(FAILED);
          expect(newActivityInstanceFetchStatus).not.toEqual(prevNewActivityInstanceFetchStatus);
        });

        it(`no new activityInstance was created`, async () => {
          const preDispatchActivityInstances = getActivityInstanceEntities(prevState);

          await store.dispatch(createActivityInstanceThunk);

          const newState = store.getState();
          const postDispatchActivityInstances = getActivityInstanceEntities(newState);

          expect(preDispatchActivityInstances.length).toEqual(postDispatchActivityInstances.length);
        });

        it(`matching activityType's activityCount remains the same`, async () => {
          const preDispatchActivityType = getEntityByName({
            name: 'Write seed data',
            entityType: 'activityType',
            state: prevState,
          });
          const preDispatchCount = preDispatchActivityType.activityCount;

          await store.dispatch(createActivityInstanceThunk);

          const newState = store.getState();
          const postDispatchActivityType = getEntityByName({
            name: 'Write seed data',
            entityType: 'activityType',
            state: newState,
          });
          const postDispatchCount = postDispatchActivityType.activityCount;

          expect(preDispatchCount).toEqual(postDispatchCount);
        });
      });

      describe('matching activityType DNE', () => {
        set('createActivityInstancePayload', () => ({
          name: 'new activity type',
          categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
          start: '2017-10-20T17:00:00.000-07:00',
        }));

        it(`the new activityInstance fetch status is set to ${FAILED}`, async() => {
          const prevNewActivityInstanceFetchStatus = getNewActivityInstanceFetchStatus(prevState);

          await store.dispatch(createActivityInstanceThunk);

          const newState = store.getState();
          const newActivityInstanceFetchStatus = getNewActivityInstanceFetchStatus(newState);

          expect(newActivityInstanceFetchStatus).toEqual(FAILED);
          expect(newActivityInstanceFetchStatus).not.toEqual(prevNewActivityInstanceFetchStatus);
        });

        it(`no new activityInstance was created`, async () => {
          const preDispatchActivityInstances = getActivityInstanceEntities(prevState);

          await store.dispatch(createActivityInstanceThunk);

          const newState = store.getState();
          const postDispatchActivityInstances = getActivityInstanceEntities(newState);

          expect(preDispatchActivityInstances.length).toEqual(postDispatchActivityInstances.length);
        });

        it(`no new activityType was created`, async () => {
          const preDispatchActivityTypeEntities = getActivityTypeEntities(prevState);

          await store.dispatch(createActivityInstanceThunk);

          const newState = store.getState();
          const postDispatchActivityTypeEntities = getActivityTypeEntities(newState);

          expect(preDispatchActivityTypeEntities.length).toEqual(postDispatchActivityTypeEntities.length);
        });
      });
    });
  });

  describe('updateActivityInstance', () => {
    set('updateId', () => 'f36c74b2-c798-4d8f-a8cb-d353ee3b2c44');
    set('propsToUpdate', () => ({
      end: '2017-10-21T05:00:00.000Z',
      isComplete: true,
    }));
    set('updateActivityInstanceThunk', () => updateActivityInstance({id: updateId, propsToUpdate, client: gqlClient}));

    describe(`${UPDATE_ACTIVITY_INSTANCE_REQUEST}`, () => {
      set('updateActivityInstanceRequestAction', () => updateActivityInstanceRequest({id: updateId, propsToUpdate}));

      it(`'${UPDATE_ACTIVITY_INSTANCE_REQUEST}' was the first action dispatched by the store`, () => {
        mockStore.dispatch(updateActivityInstanceRequestAction);

        const actions = mockStore.getActions();
        const firstAction = actions[0];

        expect(firstAction.type).toEqual(UPDATE_ACTIVITY_INSTANCE_REQUEST);
      });

      it(`'${UPDATE_ACTIVITY_INSTANCE_REQUEST}' sets the appropriate fetch status to '${UPDATING}'`, () => {
        const oldFetchStatuses = getActivityInstanceFetchStatus(prevState);
        const oldFetchStatus = oldFetchStatuses[updateId];

        store.dispatch(updateActivityInstanceRequestAction);

        const newState = store.getState();
        const newFetchStatuses = getActivityInstanceFetchStatus(newState);
        const newFetchStatus = newFetchStatuses[updateId];

        expect(newFetchStatus).toEqual(UPDATING);
        expect(newFetchStatus).not.toEqual(oldFetchStatus);
      });
    });

    // At the moment, updateActivityInstance doesn't utilize the response and 
    // if nothing fails, dispatches UPDATE_ACTIVITY_INSTANCE_SUCCESS which 
    // updates the store.
    set('mutate', () => () => {});

    beforeEach(() => gqlClient.mutate = mutate);

    describe(`successfully updates the activityInstance entity`, () => {
      it(`actions ${UPDATE_ACTIVITY_INSTANCE_REQUEST} and ${UPDATE_ACTIVITY_INSTANCE_SUCCESS} were dispatched`, async () => {
        await mockStore.dispatch(updateActivityInstanceThunk);

        const expectedActionTypes = [UPDATE_ACTIVITY_INSTANCE_REQUEST, UPDATE_ACTIVITY_INSTANCE_SUCCESS];
        const actions = mockStore.getActions();
        const actionTypes = actions.map(action => action.type);

        expect(actionTypes).toEqual(expectedActionTypes);
      });

      it('the activityInstance entity properties were updated', async () => {
        const preUpdateActivityInstances = getActivityInstanceEntities(prevState);
        const preUpdateActivityInstance = preUpdateActivityInstances[updateId];

        await store.dispatch(updateActivityInstanceThunk);

        const newState = store.getState();
        const activityInstances = getActivityInstanceEntities(newState);
        const activityInstance = activityInstances[updateId];

        expect(activityInstance.end).toEqual('2017-10-21T05:00:00.000Z');
        expect(activityInstance.isComplete).toEqual(true);
        expect(activityInstance).not.toEqual(preUpdateActivityInstance);
      });

      it(`the activityInstance entity fetchStatus is ${LOADED} post update`, async () => {
        await store.dispatch(updateActivityInstanceThunk);

        const newState = store.getState();
        const fetchStatuses = getActivityInstanceFetchStatus(newState);
        const fetchStatus = fetchStatuses[updateId];

        expect(fetchStatus).toEqual(LOADED);
      });
    });

    describe(`fails to update the activityInstance`, () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error('Error updating activityInstance');
        }
      });

      it(`actions ${UPDATE_ACTIVITY_INSTANCE_REQUEST} and ${UPDATE_ACTIVITY_INSTANCE_FAILURE} were dispatched`, async () => {
        const expectedActionTypes = [UPDATE_ACTIVITY_INSTANCE_REQUEST, UPDATE_ACTIVITY_INSTANCE_FAILURE];

        await mockStore.dispatch(updateActivityInstanceThunk);

        const actions = mockStore.getActions();
        const actionTypes = actions.map(action => action.type);

        expect(actionTypes).toEqual(expectedActionTypes);
      });

      it(`fetchStatus was set to ${FAILED}`, async () => {
        debugger
        const previousFetchStatuses = getActivityInstanceFetchStatus(prevState);
        const previousFetchStatus = previousFetchStatuses[updateId];

        await store.dispatch(updateActivityInstanceThunk);

        const newState = store.getState();
        const newFetchStatuses = getActivityInstanceFetchStatus(newState);
        const newFetchStatus = newFetchStatuses[updateId];

        expect(newFetchStatus).toEqual(FAILED);
        expect(newFetchStatus).not.toEqual(previousFetchStatus);
      });

      it(`activityInstance was not updated`, async () => {
        const preUpdateActivityInstances = getActivityInstanceEntities(prevState);
        const preUpdateActivityInstance = preUpdateActivityInstances[updateId];

        await store.dispatch(updateActivityInstanceThunk);

        const newState = store.getState();
        const activityInstances = getActivityInstanceEntities(newState);
        const activityInstance = activityInstances[updateId];

        expect(activityInstance.end).toBeNull();
        expect(activityInstance.isComplete).toEqual(false);
        expect(activityInstance).toEqual(preUpdateActivityInstance);
      });
    });
  });

  describe('deleteActivityInstance', () => {
    set('id', () => '9cd962f2-be8c-4622-9e26-3524d3baf503');
    set('deleteActivityType', () => ({
      id: '7e28c0e7-a213-4c4c-84bf-e3dd8db9c9b5',
      name: 'Reddit',
      activityCount: 3,
      // category_name: 'INTERNET',
      category: '8efe9651-7a62-4323-9eef-080a90157b93',
      categoryId: '8efe9651-7a62-4323-9eef-080a90157b93',
      userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
    }))
    set('deleteActivityInstancePayload', () => ({
      id,
      activityType: deleteActivityType,
      client: gqlClient,
    }));
    set('deleteActivityInstanceThunk', () => deleteActivityInstance(deleteActivityInstancePayload));

    beforeEach(() => gqlClient.mutate = () => {});

    describe(`${DELETE_ACTIVITY_INSTANCE_REQUEST}`, () => {
      set('deleteActivityInstanceRequestAction', () => deleteActivityInstanceRequest(deleteActivityInstancePayload));

      it(`${DELETE_ACTIVITY_INSTANCE_REQUEST} was dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [DELETE_ACTIVITY_INSTANCE_REQUEST],
          action: deleteActivityInstanceRequestAction,
        });
      });

      it(`activityInstance fetchStatus was set to ${DELETING}`, async () => {
        await entityFetchStatusWasSet({
          id,
          action: deleteActivityInstanceRequestAction,
          store,
          entityType: 'activityInstance',
          expectedStatus: DELETING,
          statusShouldDiffer: true,
        });
      });
    });

    describe(`deleteActivityInstance was successful`, () => {
      it('expected actions dispatched', async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            DELETE_ACTIVITY_INSTANCE_REQUEST,
            DELETE_ACTIVITY_INSTANCE_SUCCESS,
            UPDATE_ACTIVITY_TYPE_SUCCESS,
          ],
          action: deleteActivityInstanceThunk,
        });
      });

      it('activityInstance was deleted', async () => {
        await entityWasDeleted({
          id,
          store,
          entityType: 'activityInstance',
          action: deleteActivityInstanceThunk,
        });
      });

      it('activityInstance fetchStatus was deleted', async () => {
        await entityFetchStatusWasDeleted({
          id,
          entityType: 'activityInstance',
          store,
          action: deleteActivityInstanceThunk,
        });
      });

      it('related activityType activityCount was reduced by 1', async () => {
        const {activityCount} = deleteActivityType;
        const activityTypeId = deleteActivityType.id;

        await validateEntityPropertyValue({
          id: activityTypeId,
          entityType: 'activityType',
          propertyName: 'activityCount',
          expectedValue: activityCount - 1,
          action: deleteActivityInstanceThunk,
          store,
        });
      });
    });

    describe(`deleteActivityInstance failed`, () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error(`Error deleting activityInstance`);
        }
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            DELETE_ACTIVITY_INSTANCE_REQUEST,
            DELETE_ACTIVITY_INSTANCE_FAILURE,
          ],
          action: deleteActivityInstanceThunk,
        });
      });

      it('activityInstance was not deleted', async () => {
        await entityWasNotDeleted({
          id,
          store,
          entityType: 'activityInstance',
          action: deleteActivityInstanceThunk,
        });
      });

      it(`activityInstance fetchStatus was set to ${FAILED}`, async () => {
        await entityFetchStatusWasSet({id,
          store,
          entityType: 'activityInstance',
          action: deleteActivityInstanceThunk,
          expectedStatus: FAILED,
          statusShouldDiffer: true,
        });
      });

      it(`related activityType's activityCount was unchanged`, async () => {
        await validateEntityPropertyValue({
          id: deleteActivityType.id,
          entityType: 'activityType',
          propertyName: 'activityCount',
          expectedValue: deleteActivityType.activityCount,
          action: deleteActivityInstanceThunk,
          store,
        });
      });
    });
  });
});

const validateEntityPropertyValue = async ({id, entityType, propertyName, expectedValue, action, store}) => {
  await store.dispatch(action);

  const state = store.getState();
  const entity = getEntityById({id, entityType, state});

  expect(entity[propertyName]).toEqual(expectedValue);
}

const entityFetchStatusWasDeleted = async ({id, entityType, store, action}) => {
  const previousState = store.getState();
  const previousEntityFetchStatus = getEntityFetchStatus({id, entityType, state: previousState});

  await store.dispatch(action);

  const newState = store.getState();
  const newEntityFetchStatus = getEntityFetchStatus({id, entityType, state: newState});

  expect(newEntityFetchStatus).toBeUndefined();
  expect(previousEntityFetchStatus).toBeDefined();
}

const actionsWereDispatched = async ({mockStore, expectedActionTypes, action}) => {
  await mockStore.dispatch(action);

  const actions = mockStore.getActions();
  const actionTypes = actions.map(action => action.type);

  expect(actionTypes).toEqual(expectedActionTypes);
}

const entityFetchStatusWasSet = async ({id, store, entityType, action, expectedStatus, statusShouldDiffer}) => {
  const previousState = store.getState();

  await store.dispatch(action);

  const newState = store.getState();
  const newFetchStatuses = getEntityFetchStatuses({entityType, state: newState});
  const newFetchStatus = newFetchStatuses[id];

  expect(newFetchStatus).toEqual(expectedStatus);

  if (statusShouldDiffer) {
    const previousFetchStatuses = getEntityFetchStatuses({entityType, state: previousState});
    const previousFetchStatus = previousFetchStatuses[id];

    expect(newFetchStatus).not.toEqual(previousFetchStatus);
  }
}

const entityWasDeleted = async ({id, store, entityType, action}) => {
  const previousState = store.getState();
  const previousEntities = getEntities({entityType, state: previousState});

  await store.dispatch(action);

  const newState = store.getState();
  const newEntities = getEntities({entityType, state: newState});

  expect(previousEntities[id]).toBeDefined();
  expect(newEntities[id]).toBeUndefined();
}

const entityWasNotDeleted = async ({id, store, entityType, action}) => {
  await store.dispatch(action);

  const state = store.getState();
  const entities = getEntities({entityType, state});

  expect(entities[id]).toBeDefined();
}

const dispatch = ({store, mockStore, action}) => Promise.all([
  store.dispatch(action),
  mockStore.dispatch(action),
]);

const getNewEntityId = ({mockStore, actionType, entityType}) => {
  const actions = mockStore.getActions();
  const action = actions.find(action => action.type === actionType);
  const {payload} = action;
  const entity = payload[entityType];

  return entity.id;
}