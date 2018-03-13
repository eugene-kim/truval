import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import root from 'redux/reducers/root';
import initialState from '../initialState';
import {
  UPDATE_ACTIVITY_TYPE_REQUEST,
} from 'redux/actions/types'

import {
  validateEntityPropertyValue,
  entityFetchStatusWasDeleted,
  actionsWereDispatched,
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

import {
  updateActivityTypeRequest,
} from 'redux/actions/entities/activityType';


describe('activityType entity actions', () => {
  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('mockStore', () => configureStore(middleware)(initialState));

  // NOTE: We've already tested addActivityType in our activityInstance tests, so we
  // won't be testing that action here.

  describe('updateActivityType', () => {
    set('id', () => '1982f070-704c-4054-beb4-ea188399fc10');
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
    });
  });
});