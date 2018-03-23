import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import root from 'src/redux/reducers/root';
import client from 'src/graphql/client';
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
} from 'src/redux/actions/entities/activityInstance';

import { getEntityByName } from 'src/redux/reducers/selectors/entitySelectors';

import {
  validateEntityPropertyValue,
  entityFetchStatusWasDeleted,
  entityFetchStatusWasSet,
  entityFetchStatusWasCreated,
  newEntityFetchStatusWasSet,
  entityWasDeleted,
  entityWasNotDeleted,
  entityWasUpdated,
  entityWasNotUpdated,
  entityWasCreated,
  entityWasNotCreated,
} from './entityTestMethods';

import { actionsWereDispatched } from '../reduxTestMethods';

import {
  UPDATING,
  LOADING,
  LOADED,
  FAILED,
  DELETING,
} from 'src/redux/reducers/fetchStatus';

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
} from 'src/redux/actions/types';


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
            "activityType": "1982f070-704c-4054-beb4-ea188399fc10",
            "sessionId": "997a5210-33d1-4198-a4a4-5f1ea477cc01"
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
      sessionId: '997a5210-33d1-4198-a4a4-5f1ea477cc01',
      start: '2017-10-20T17:00:00.000-07:00',
    }));

    set('createActivityInstanceThunk', () => createActivityInstance({
      activityInstance: createActivityInstancePayload,
      client: gqlClient,
    }));

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
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [CREATE_ACTIVITY_INSTANCE_REQUEST],
          action: createActivityInstanceRequestAction
        });
      });

      it(`set the new fetchStatus to '${LOADING}'`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'activityInstance',
          expectedStatus: LOADING,
          store,
          action: createActivityInstanceRequestAction,
        });
      });
    });

    describe('successful activityInstance creation', () => {
      it(`expected actions were dispatched`, async () => {

        await mockStore.dispatch(createActivityInstance({
          activityInstance: createActivityInstancePayload,
          client: gqlClient,
        }));

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
            await newEntityFetchStatusWasSet({
              entityType: 'activityInstance',
              expectedStatus: LOADED,
              store,
              action: createActivityInstanceThunk,
            });
          });

          it(`the matching activityType's activityCount was increased by 1`, async () => {
            const prevActivityType = getEntityByName({
              name: createActivityInstancePayload.name,
              entityType: 'activityType',
              state: prevState,
            });
            const {id} = prevActivityType;
            const previousCount = prevActivityType.activityCount;

            await validateEntityPropertyValue({
              id,
              entityType: 'activityType',
              propertyName: 'activityCount',
              expectedValue: previousCount + 1,
              action: createActivityInstanceThunk,
              store,
            });
          });

          it('a new activityInstance entity was created', async () => {
            await entityWasCreated({
              entityType: 'activityInstance',
              store,
              mockStore,
              action: createActivityInstanceThunk,
              createEntityActionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
            });
          });

          it(`a new fetch status for the new activityInstance entity was created and set to '${LOADED}'`, async () => {
            await entityFetchStatusWasCreated({
              entityType: 'activityInstance',
              store,
              mockStore,
              action: createActivityInstanceThunk,
              createEntityActionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
              expectedStatus: LOADED,
            });
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
                  "activityType": "585915a7-3e84-4308-bf95-bd17447658d0",
                  "sessionId": "997a5210-33d1-4198-a4a4-5f1ea477cc01"
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
            await newEntityFetchStatusWasSet({
              entityType: 'activityInstance',
              expectedStatus: LOADED,
              store,
              action: createActivityInstanceThunk,
            });
          });

          it('a new activityType entity was created', async () => {
            await entityWasCreated({
              entityType: 'activityType',
              store,
              mockStore,
              action: createActivityInstanceThunk,
              createEntityActionType: ADD_ACTIVITY_TYPE,
            });
          });

          it(`a new activityType entity fetchStatus was created and set to '${LOADED}'`, async () => {
            await entityFetchStatusWasCreated({
              entityType: 'activityType',
              store,
              mockStore,
              action: createActivityInstanceThunk,
              createEntityActionType: ADD_ACTIVITY_TYPE,
              expectedStatus: LOADED,
            });
          });

          it('a new activityInstance entity was created', async () => {
            await entityWasCreated({
              entityType: 'activityInstance',
              store,
              mockStore,
              action: createActivityInstanceThunk,
              createEntityActionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
            });
          });

          it(`a new fetch status for new activityInstance was created and set to '${LOADED}'`, async () => {
            await entityFetchStatusWasCreated({
              entityType: 'activityInstance',
              store,
              mockStore,
              action: createActivityInstanceThunk,
              createEntityActionType: CREATE_ACTIVITY_INSTANCE_SUCCESS,
              expectedStatus: LOADED,
            });
          });
        });
      });
    });

    describe('failed activityInstance creation', () => {
      beforeEach(() => gqlClient.mutate = () => {
        throw new Error('Error creating activityInstance');
      });

      it('expected actions were dispatched', async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            CREATE_ACTIVITY_INSTANCE_REQUEST,
            CREATE_ACTIVITY_INSTANCE_FAILURE,
          ],
          action: createActivityInstanceThunk,
        });
      });

      describe('matching activityType exists', () => {
        it(`the new activityInstance fetch status is set to ${FAILED}`, async () => {
          await newEntityFetchStatusWasSet({
            entityType: 'activityInstance',
            expectedStatus: FAILED,
            store,
            action: createActivityInstanceThunk,
            statusShouldDiffer: true,
          });
        });

        it(`no new activityInstance was created`, async () => {
          await entityWasNotCreated({
            entityType: 'activityInstance',
            store,
            action: createActivityInstanceThunk,
          });
        });

        it(`matching activityType's activityCount remains the same`, async () => {
          const preDispatchActivityType = getEntityByName({
            name: 'Write seed data',
            entityType: 'activityType',
            state: prevState,
          });
          const preDispatchCount = preDispatchActivityType.activityCount;

          await validateEntityPropertyValue({
            id: preDispatchActivityType.id,
            entityType: 'activityType',
            propertyName: 'activityCount',
            expectedValue: preDispatchCount,
            action: createActivityInstanceThunk,
            store,
          });
        });
      });

      describe('matching activityType DNE', () => {
        set('createActivityInstancePayload', () => ({
          name: 'new activity type',
          categoryId: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
          start: '2017-10-20T17:00:00.000-07:00',
        }));

        it(`the new activityInstance fetch status is set to ${FAILED}`, async() => {
          await newEntityFetchStatusWasSet({
            entityType: 'activityInstance',
            expectedStatus: FAILED,
            store,
            action: createActivityInstanceThunk,
          });
        });

        it(`no new activityInstance was created`, async () => {
          await entityWasNotCreated({
            entityType: 'activityInstance',
            store,
            action: createActivityInstanceThunk,
          });
        });

        it(`no new activityType was created`, async () => {
          await entityWasNotCreated({
            entityType: 'activityType',
            store,
            action: createActivityInstanceThunk,
          });
        });
      });
    });
  });

  describe('updateActivityInstance', () => {
    set('id', () => 'f36c74b2-c798-4d8f-a8cb-d353ee3b2c44');
    set('propsToUpdate', () => ({
      end: '2017-10-21T05:00:00.000Z',
      isComplete: true,
    }));
    set('updateActivityInstanceThunk', () => updateActivityInstance({id, propsToUpdate, client: gqlClient}));

    describe(`${UPDATE_ACTIVITY_INSTANCE_REQUEST}`, () => {
      set('updateActivityInstanceRequestAction', () => updateActivityInstanceRequest({id, propsToUpdate}));

      it(`'${UPDATE_ACTIVITY_INSTANCE_REQUEST}' was the first action dispatched by the store`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [UPDATE_ACTIVITY_INSTANCE_REQUEST],
          action: updateActivityInstanceRequestAction,
        });
      });

      it(`'${UPDATE_ACTIVITY_INSTANCE_REQUEST}' sets the appropriate fetch status to '${UPDATING}'`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'activityInstance',
          action: updateActivityInstanceRequestAction,
          expectedStatus: UPDATING,
        });
      });
    });

    // At the moment, updateActivityInstance doesn't utilize the response and 
    // if nothing fails, dispatches UPDATE_ACTIVITY_INSTANCE_SUCCESS which 
    // updates the store.
    set('mutate', () => () => {});

    beforeEach(() => gqlClient.mutate = mutate);

    describe(`successfully updates the activityInstance entity`, () => {
      it(`actions ${UPDATE_ACTIVITY_INSTANCE_REQUEST} and ${UPDATE_ACTIVITY_INSTANCE_SUCCESS} were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            UPDATE_ACTIVITY_INSTANCE_REQUEST,
            UPDATE_ACTIVITY_INSTANCE_SUCCESS,
          ],
          action: updateActivityInstanceThunk,
        });
      });

      it('the activityInstance entity properties were updated', async () => {
        await entityWasUpdated({
          id,
          entityType: 'activityInstance',
          propsToUpdate,
          store,
          action: updateActivityInstanceThunk,
        });
      });

      it(`the activityInstance entity fetchStatus is ${LOADED} post update`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'activityInstance',
          action: updateActivityInstanceThunk,
          expectedStatus: LOADED,
          statusShouldDiffer: true,
        });
      });
    });

    describe(`fails to update the activityInstance`, () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error('Error updating activityInstance');
        }
      });

      it(`actions ${UPDATE_ACTIVITY_INSTANCE_REQUEST} and ${UPDATE_ACTIVITY_INSTANCE_FAILURE} were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            UPDATE_ACTIVITY_INSTANCE_REQUEST,
            UPDATE_ACTIVITY_INSTANCE_FAILURE,
          ],
          action: updateActivityInstanceThunk,
        });
      });

      it(`fetchStatus was set to ${FAILED}`, async () => {
        await entityFetchStatusWasSet({
          id: id,
          store,
          entityType: 'activityInstance',
          action: updateActivityInstanceThunk,
          expectedStatus: FAILED,
          statusShouldDiffer: true,
        });
      });

      it(`activityInstance was not updated`, async () => {
        await entityWasNotUpdated({
          id,
          entityType: 'activityInstance',
          propsToUpdate: {
            end: '2017-10-21T05:00:00.000Z',
            isComplete: true,
          },
          store,
          action: updateActivityInstanceThunk,
        });
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