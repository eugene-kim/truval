import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import root from 'redux/reducers/root';
import client from 'graphql/client';
import initialState from '../initialState';
import {
  UPDATE_ACTIVITY_TYPE_REQUEST,
  UPDATE_ACTIVITY_TYPE_SUCCESS,
  UPDATE_ACTIVITY_TYPE_FAILURE,
  REMOVE_ACTIVITY_TYPE,
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
  updateActivityTypeRequest,
  updateActivityType,
  removeActivityType,
} from 'redux/actions/entities/activityType';

import {
  UPDATING,
  LOADING,
  LOADED,
  FAILED,
  DELETING,
} from 'redux/reducers/fetchStatus';

describe('activityType entity actions', () => {
  set('id', () => '1982f070-704c-4054-beb4-ea188399fc10');

  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('mockStore', () => configureStore(middleware)(initialState));
  set('gqlClient', () => client({store}));

  // NOTE: We've already tested addActivityType in our activityInstance tests, so we
  // won't be testing that action here.

  describe('updateActivityType', () => {
    set('propsToUpdate', () => ({

      // Previously 'Write seed data'
      name: 'Write the best seed data',
    }));

    describe('updateActivityTypeRequest', () => {
      set('updateActivityTypeRequestAction', () =>
        updateActivityTypeRequest({id, propsToUpdate})
      );

      it(`${UPDATE_ACTIVITY_TYPE_REQUEST} was dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [UPDATE_ACTIVITY_TYPE_REQUEST],
          action: updateActivityTypeRequestAction
        });
      });

      it(`activityType entity fetch status was set to ${UPDATING}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'activityType',
          action: updateActivityTypeRequestAction,
          expectedStatus: UPDATING,
          statusShouldDiffer: true,
        });
      });
    });

    set('updateActivityTypeThunk', () => updateActivityType({id, propsToUpdate, client: gqlClient}));

    describe('updateActivityType success', () => {
      beforeEach(() => {
        gqlClient.mutate = () => {};
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            UPDATE_ACTIVITY_TYPE_REQUEST,
            UPDATE_ACTIVITY_TYPE_SUCCESS,
          ],
          action: updateActivityTypeThunk,
        });
      });

      it(`activityType entity fetch status was set to ${LOADED}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'activityType',
          action: updateActivityTypeThunk,
          expectedStatus: LOADED,
          statusShouldDiffer: true,
        });
      });

      it(`activityType was updated`, async () => {
        await entityWasUpdated({
          id,
          entityType: 'activityType',
          propsToUpdate,
          store,
          action: updateActivityTypeThunk,
        });
      });
    });

    describe(`updateActivityType failure`, () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error(`Error updating activityType!`);
        };
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            UPDATE_ACTIVITY_TYPE_REQUEST,
            UPDATE_ACTIVITY_TYPE_FAILURE,
          ],
          action: updateActivityTypeThunk,
        });
      });

      it(`activityType entity fetch status was set to ${FAILED}`, async () => {
        await entityFetchStatusWasSet({
          id,
          store,
          entityType: 'activityType',
          action: updateActivityTypeThunk,
          expectedStatus: FAILED,
          statusShouldDiffer: true,
        });
      });

      it(`activityType was not updated`, async () => {
        await entityWasNotUpdated({
          id,
          entityType: 'activityType',
          propsToUpdate,
          store,
          action: updateActivityTypeThunk,
        });
      });
    });
  });

  describe(`removeActivityType`, () => {
    set('removeActivityTypeAction', () => removeActivityType(id));

    it(`activityType instance was deleted`, async () => {
      await entityWasDeleted({
        id,
        store,
        entityType: 'activityType',
        action: removeActivityTypeAction,
      });
    });

    it(`activityType entity fetch status was deleted`, async () => {
      await entityFetchStatusWasDeleted({
        id,
        entityType: 'activityType',
        store,
        action: removeActivityTypeAction,
      });
    });
  });
});