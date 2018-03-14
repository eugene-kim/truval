import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import root from 'redux/reducers/root';
import client from 'graphql/client';
import initialState from '../initialState';
import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
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
  createCategoryRequest,
  createCategory,
  updateCategoryRequest,
  updateCategory,
  deleteCategoryRequest,
  deleteCategory,
} from 'redux/actions/entities/category';

import {
  UPDATING,
  LOADING,
  LOADED,
  FAILED,
  DELETING,
} from 'redux/reducers/fetchStatus';

describe('category entity actions', () => {
  const middleware = [thunk];

  set('store', () => createStore(
    root,
    initialState,
    applyMiddleware(...middleware),
  ));

  set('mockStore', () => configureStore(middleware)(initialState));
  set('gqlClient', () => client({store}));

  describe('createCategory', () => {
    set('category', () => ({
      name: 'new category',
      isPrimary: true,
      color: '#3E416A',
      userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
    }));

    describe('createCategoryRequest', () => {
      set('createCategoryRequestAction', () => createCategoryRequest({category}));

      it('expected actions were dispatched', async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [CREATE_CATEGORY_REQUEST],
          action: createCategoryRequestAction,
        });
      });

      it(`new category fetchStatus was to ${LOADING}`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'category',
          expectedStatus: LOADING,
          store,
          action: createCategoryRequestAction,
        });
      });
    });

    set('createCategoryThunk', () => createCategory({category, client: gqlClient}));

    describe('successful createCategory', () => {
      beforeEach(() => {
        gqlClient.mutate = () => ({
          data: {
            createCategory: {
              id: '852cc22b-9628-426d-afd0-17d549fb8479',
              name: 'new category',
              isPrimary: true,
              color: '#3E416A',
            }
          }
        });
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            CREATE_CATEGORY_REQUEST,
            CREATE_CATEGORY_SUCCESS,
          ],
          action: createCategoryThunk,
        });
      });

      it(`new category entity was created`, async () => {
        await entityWasCreated({
          entityType: 'category',
          store,
          mockStore,
          action: createCategoryThunk,
          createEntityActionType: CREATE_CATEGORY_SUCCESS,
        });
      });

      it(`new category entity fetchStatus was created and set to ${LOADED}`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'category',
          expectedStatus: LOADED,
          store,
          action: createCategoryThunk,
        });
      });
    });

    describe('failed createCategory', () => {
      beforeEach(() => {
        gqlClient.mutate = () => {
          throw new Error(`Error creating new category`);
        }
      });

      it(`expected actions were dispatched`, async () => {
        await actionsWereDispatched({
          mockStore,
          expectedActionTypes: [
            CREATE_CATEGORY_REQUEST,
            CREATE_CATEGORY_FAILURE,
          ],
          action: createCategoryThunk,
        });
      });

      it('category was not created', async () => {
        await entityWasNotCreated({
          entityType: 'category',
          store,
          action: createCategoryThunk,
        });
      });

      it(`new category fetch status was set to ${FAILED}`, async () => {
        await newEntityFetchStatusWasSet({
          entityType: 'category',
          expectedStatus: FAILED,
          store,
          action: createCategoryThunk,
        });
      });
    });
  });

  set('id', () => 'ca05ca36-805c-4f67-a097-a45988ba82d7');

  describe('updateCategory', () => {
    describe('updateCategoryRequest', () => {
      
    });
  });

  describe('deleteCategory', () => {
    describe('deleteCategoryRequest', () => {

    });
  });
});