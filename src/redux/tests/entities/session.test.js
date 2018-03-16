import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import root from 'redux/reducers/root';
import client from 'graphql/client';
import initialState from '../initialState';
import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  UPDATE_SESSION_REQUEST,
  UPDATE_SESSION_SUCCESS,
  UPDATE_SESSION_FAILURE,
  DELETE_SESSION_REQUEST,
  DELETE_SESSION_SUCCESS,
  DELETE_SESSION_FAILURE,
} from 'redux/actions/types'

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
  createSessionRequest,
  createSession,
  updateSessionRequest,
  updateSession,
  deleteSessionRequest,
  deleteSession,
} from 'redux/actions/entities/session';

import {
  UPDATING,
  LOADING,
  LOADED,
  FAILED,
  DELETING,
} from 'redux/reducers/fetchStatus';

describe('session entity actions', () => {
  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('mockStore', () => configureStore(middleware)(initialState));
  set('gqlClient', () => client({store}));

  describe('createSession', () => {
    set('session', () => ({
      name: 'new session',
      isPrimary: true,
      color: '#3E416A',
      userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
    }));

    describe('createSessionRequest', () => {
      set('createSessionRequestAction', () => createSessionRequest({session}));

      it('expected actions were dispatched', async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [CREATE_SESSION_REQUEST],
          action: createSessionRequestAction,
        });
      });

      it(`new session fetchStatus was to ${LOADING}`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'session',
          expectedStatus: LOADING,
          store,
          action: createSessionRequestAction,
        });
      });
    });

    set('createSessionThunk', () => createSession({session, client: gqlClient}));

    describe('successful createSession', () => {
      beforeEach(() => {
        gqlClient.mutate = () => ({
          data: {
            createSession: {
              id: '5aa03fde-cbcb-4c1f-ab82-571032dcc36c',
              name: 'Study Session 0',
              start: '2017-10-21T22:51:09.489Z',
              end: null,
              isComplete: false,
              userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
            }
          }
        });
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            CREATE_SESSION_REQUEST,
            CREATE_SESSION_SUCCESS,
          ],
          action: createSessionThunk,
        });
      });

      it(`new session entity was created`, async () => {
        await entityWasCreated({
          entityType: 'session',
          store,
          mockStore,
          action: createSessionThunk,
          createEntityActionType: CREATE_SESSION_SUCCESS,
        });
      });

      it(`new session entity fetchStatus was created and set to ${LOADED}`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'session',
          expectedStatus: LOADED,
          store,
          action: createSessionThunk,
        });
      });
    });

    describe('failed createSession', () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error(`Error creating new session`);
        }
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            CREATE_SESSION_REQUEST,
            CREATE_SESSION_FAILURE,
          ],
          action: createSessionThunk,
        });
      });

      it('session was not created', async () => {
        await entityWasNotCreated({
          entityType: 'session',
          store,
          action: createSessionThunk,
        });
      });

      it(`new session fetch status was set to ${FAILED}`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'session',
          expectedStatus: FAILED,
          store,
          action: createSessionThunk,
        });
      });
    });
  });

  set('id', () => '997a5210-33d1-4198-a4a4-5f1ea477cc01');

  describe('updateSession', () => {
    set('propsToUpdate', () => ({
      name: 'Study Session ONE',
      end: '2017-10-21T22:59:09.489Z',
      isComplete: true,
    }));

    describe('updateSessionRequest', () => {
      set('updateSessionRequestAction', () => updateSessionRequest({id, propsToUpdate}));

      it(`expected action ${UPDATE_SESSION_REQUEST} was dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [UPDATE_SESSION_REQUEST],
          action: updateSessionRequestAction,
        });
      });

      it(`session entity fetch status was set to ${UPDATING}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'session',
          action: updateSessionRequestAction,
          expectedStatus: UPDATING,
          statusShouldDiffer: true,
        });
      });
    });

    set('updateSessionThunk', () => updateSession({id, propsToUpdate, client: gqlClient}));

    describe(`successful updateSession`, () => {
      beforeEach(() => {
        gqlClient.mutate = () => {};
      });

      it(`${UPDATE_SESSION_REQUEST} and ${UPDATE_SESSION_SUCCESS} were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            UPDATE_SESSION_REQUEST,
            UPDATE_SESSION_SUCCESS,
          ],
          action: updateSessionThunk,
        });
      });

      it(`session was updated`, async () => {
        await entityWasUpdated({
          id,
          entityType: 'session',
          propsToUpdate,
          store,
          action: updateSessionThunk,
        });
      });

      it(`session entity fetch status was set to ${LOADED}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'session',
          action: updateSessionThunk,
          expectedStatus: LOADED,
          statusShouldDiffer: true,
        });
      });
    });

    describe(`failed updateSession`, () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error(`Error updating session`);
        }
      });

      it(`actions ${UPDATE_SESSION_REQUEST} and ${UPDATE_SESSION_FAILURE} were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            UPDATE_SESSION_REQUEST,
            UPDATE_SESSION_FAILURE,
          ],
          action: updateSessionThunk,
        });
      });

      it(`session was not updated`, async () => {
        await entityWasNotUpdated({
          id,
          propsToUpdate,
          entityType: 'session',
          store,
          action: updateSessionThunk,
        });
      });

      it(`session entity fetch status was set to ${FAILED}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'session',
          action: updateSessionThunk,
          expectedStatus: FAILED,
          statusShouldDiffer: true,
        });
      });
    });
  });

  describe('deleteSession', () => {
    describe('deleteSessionRequest', () => {
      set('deleteSessionRequestAction', () => deleteSessionRequest(id));

      it(`expected action ${DELETE_SESSION_REQUEST} was dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [DELETE_SESSION_REQUEST],
          action: deleteSessionRequestAction,
        });
      });

      it(`session entity fetchStatus was set to ${DELETING}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'session',
          action: deleteSessionRequestAction,
          expectedStatus: DELETING,
          statusShouldDiffer: true,
        });
      });
    });

    set('deleteSessionThunk', () => deleteSession({id, client: gqlClient}));

    describe('successful deleteSession', () => {
      beforeEach(() => {
        gqlClient.mutate = () => {};
      });

      it(`actions ${DELETE_SESSION_REQUEST} and ${DELETE_SESSION_SUCCESS} were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [DELETE_SESSION_REQUEST, DELETE_SESSION_SUCCESS],
          action: deleteSessionThunk,
        });
      });

      it(`session entity was deleted`, async () => {
        await entityWasDeleted({
          id,
          store,
          action: deleteSessionThunk,
          entityType: 'session',
        });
      });

      it(`session entity fetchStatus was deleted`, async () => {
        await entityFetchStatusWasDeleted({
          id,
          store,
          action: deleteSessionThunk,
          entityType: 'session',
        });
      });
    });

    describe('failed deleteSession', () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error(`Error deleting session`);
        }
      });

      it(`expected actions ${DELETE_SESSION_REQUEST} and ${DELETE_SESSION_FAILURE} were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [DELETE_SESSION_REQUEST, DELETE_SESSION_FAILURE],
          action: deleteSessionThunk,
        });
      });

      it(`session entity was not deleted`, async () => {
        await entityWasNotDeleted({
          id,
          entityType: 'session',
          store,
          action: deleteSessionThunk,
        });
      });

      it(`session entity fetchStatus was set to ${FAILED}`, async () => {
        await entityFetchStatusWasSet({
          id,
          entityType: 'session',
          store,
          action: deleteSessionThunk,
          expectedStatus: FAILED,
          statusShouldDiffer: true,
        });
      });
    });
  });
});
