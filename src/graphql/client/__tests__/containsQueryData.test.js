import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {parse} from 'graphql/language/parser';
import {createStore} from 'redux';
import _ from 'lodash';

import gqlSchema from 'graphql/schema/typeDefSchema';
import containsQueryData from '../containsQueryData';
import initialState from 'redux/store/initialState';
import reducer from 'redux/reducers/root';

describe('test containsQueryData()', () => {
  let schemaDocumentWhole;
  let schemaDoc;

  beforeEach(async () => {
    schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
    schemaDoc = schemaDocumentWhole.data.__schema;
  });

  describe('non-nested query requesting `user(id: 1)`with the fields:\n\tid, username, email, password', () => {
    set('query', () => {
      return `
        query {
          user(id: 1) {
            id,
            username,
            email,
            password,
          }
        }
      `;
    });
    set('queryAST', () => parse(query));

    it('should return false with an empty store', () => {
      const store = createStore(reducer, initialState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false with a store containing a single user but with id: 2', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                '2': {
                  id: '2',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3', '7', '8', '9']
                }
              }
            }
          }
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false with a store containing no users but an activity', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            activity: {
              entities: {
                '1': {
                  'id': '1',
                  'start': '2017-10-20T17:00:00.000-07:00',
                  'end': '2017-10-20T17:20:00.000-07:00',
                  'isComplete': true,
                  'session': '1',
                  'category': '1'
                },
              },
            },
          }
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false when store contains matching user but with no username property', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                '1': {
                  id: '1',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3', '7', '8', '9']
                }
              }
            }
          }
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return true when store contains matching user with all expected scalar fields', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                '1': {
                  id: '1',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3', '7', '8', '9']
                }
              }
            }
          }
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(true);
    });
  });

  describe('non-nested query requesting `sessions(userId: 1)` with the fields:\n\tid, name, start, isComplete', () => {
    set('query', () => {
      return `
        query {
          sessions(userId:1) {
            id, name, start, isComplete
          }
        }`;
    });
    set('queryAST', () => parse(query));

    it('should return false with an empty store', () => {
      const store = createStore(reducer, initialState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false with a store containing a user with a different id', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {

                // Id is 2 instead of 1
                '2': {
                  id: '2',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3'],
                },
              },
            },
            session: {
              entities: {
                '1': {
                  id: '1',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '3': {
                  id: '3',
                  name: 'Study Session 3',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
              },
            },
          },
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false with a store containing a matching user but with a missing session entity', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                '1': {
                  id: '1',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3'],
                },
              },
            },
            session: {
              entities: {
                '1': {
                  id: '1',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                // Missing session w/ id: 3
              },
            },
          },
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false when all entities are present but a session entity is missing scalar field', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                '1': {
                  id: '1',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3'],
                },
              },
            },
            session: {
              entities: {
                '1': {
                  id: '1',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '3': {
                  id: '3',
                  name: 'Study Session 3',
                  
                  // Missing start scalar field
                  // start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
              },
            },
          },
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return true when all entities are present with all expected scalar fields', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                '1': {
                  id: '1',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: ['1', '2', '3'],
                },
              },
            },
            session: {
              entities: {
                '1': {
                  id: '1',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
                '3': {
                  id: '3',
                  name: 'Study Session 3',
                  start: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                },
              },
            },
          },
        }
      );
      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(true);
    });
  });

  describe('4 level nested query with circular references requesting `user(id: cb39dbb5-caa8-4323-93a5-13450b875887)`', () => {
    set('query', () => {
      return `
        query {
          user(id:"cb39dbb5-caa8-4323-93a5-13450b875887") {
            id,
            username,
            categories {
              id,
              name,
              color,
            },
            sessions {
              id,
              name,
              start,
              end,
              activityInstances {
                id,
                start,
                end,
                isComplete,
                activityType {
                  id,
                  category {
                    id,
                    name,
                    color
                  }
                }
              }
            },
            activityTypes {
              id,
              name,
              activityCount,
            }
          }
        }`;
    });
    set('queryAST', () => parse(query));

    it('should return false with an empty store', () => {
      const store = createStore(reducer, initialState);
      const storeContainsData =containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return true with a store containing all entities and all scalar fields', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                'cb39dbb5-caa8-4323-93a5-13450b875887': {
                  id: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: [
                    '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                    'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  ],
                  categories: [
                    'ca05ca36-805c-4f67-a097-a45988ba82d7',
                    '083adb66-0288-4148-b0ca-ec61f99970a6',
                    '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  ],
                  activityTypes: [
                    '1982f070-704c-4054-beb4-ea188399fc10',
                    '810eca68-a948-4646-93b8-09a02d1626a1',
                    'bc577f78-bf74-4a2e-88c2-553066074dee',
                    '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                  ],
                },
              },
            },
            session: {
              entities: {
                '997a5210-33d1-4198-a4a4-5f1ea477cc01': {
                  id: '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activityInstances: [
                    'c72cea78-2027-4615-a6a1-3daca28c9bba',
                    'bf843d19-c4aa-4f18-84dd-105a45ff14c7',
                  ],
                },
                'bdcf6a74-e2e7-47f7-af8f-1c66042e119e': {
                  id: 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activityInstances: [
                    '13800618-a022-4fbb-a6ad-7ba94f93b221',
                    '67c120ef-7420-4b2e-b8d2-53e52a85501d',
                  ],
                },
              },
            },
            activityInstance: {
              entities: {
                'c72cea78-2027-4615-a6a1-3daca28c9bba': {
                  'id': 'c72cea78-2027-4615-a6a1-3daca28c9bba',
                  'start': '2017-10-20T17:00:00.000-07:00',
                  'end': '2017-10-20T17:20:00.000-07:00',
                  'isComplete': true,
                  'session': '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  'category': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'activityType': '1982f070-704c-4054-beb4-ea188399fc10',
                },
                'bf843d19-c4aa-4f18-84dd-105a45ff14c7': {
                  'id': 'bf843d19-c4aa-4f18-84dd-105a45ff14c7',
                  'start': '2017-10-20T17:20:00.000-07:00',
                  'end': '2017-10-20T17:30:00.000-07:00',
                  'isComplete': true,
                  'session': '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  'category': '083adb66-0288-4148-b0ca-ec61f99970a6',
                  'activityType': '810eca68-a948-4646-93b8-09a02d1626a1',
                },
                '13800618-a022-4fbb-a6ad-7ba94f93b221': {
                  'id': '13800618-a022-4fbb-a6ad-7ba94f93b221',
                  'start': '2017-10-20T17:30:00.000-07:00',
                  'end': '2017-10-20T17:40:00.000-07:00',
                  'isComplete': true,
                  'session': 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  'category': '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  'activityType': 'bc577f78-bf74-4a2e-88c2-553066074dee',

                },
                '67c120ef-7420-4b2e-b8d2-53e52a85501d': {
                  'id': '67c120ef-7420-4b2e-b8d2-53e52a85501d',
                  'start': '2017-10-20T17:40:00.000-07:00',
                  'end': '2017-10-20T17:55:00.000-07:00',
                  'isComplete': true,
                  'session': 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  'category': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'activityType': '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                },
              },
            },
            activityType: {
              entities: {
                '1982f070-704c-4054-beb4-ea188399fc10': {
                  id: '1982f070-704c-4054-beb4-ea188399fc10',
                  name: 'Write seed data',
                  activityCount: 6,
                  // category_name: 'CODE',
                  category: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                '810eca68-a948-4646-93b8-09a02d1626a1': {
                  id: '810eca68-a948-4646-93b8-09a02d1626a1',
                  name: 'Lunch',
                  activityCount: 3,
                  // category_name: 'EAT',
                  category: '083adb66-0288-4148-b0ca-ec61f99970a6',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                'bc577f78-bf74-4a2e-88c2-553066074dee': {
                  id: 'bc577f78-bf74-4a2e-88c2-553066074dee',
                  name: 'Poop',
                  activityCount: 3,
                  // category_name: 'POTTY',
                  category: '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                '7fc5ca14-1fec-4bf8-aba3-02a87880424e': {
                  id: '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                  name: 'Write test cases',
                  activityCount: 3,
                  // category_name: 'CODE',
                  category: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
              },
            },
            category: {
              entities: {
                'ca05ca36-805c-4f67-a097-a45988ba82d7': {
                  'id': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'color': '#3E416A',
                  'name': 'CODE'
                },
                '083adb66-0288-4148-b0ca-ec61f99970a6': {
                  'id': '083adb66-0288-4148-b0ca-ec61f99970a6',
                  'color': '#E9696A',
                  'name': 'EAT'
                },
                '51d017c1-57f1-401c-a16f-7f8142fb37d6': {
                  'id': '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  'color': '#BBD8CB',
                  'name': 'POTTY'
                },
              },
            },
          },
        }
      );

      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(true);
    });

    it('should return false with a store containing all entities but missing a single scalar field', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                'cb39dbb5-caa8-4323-93a5-13450b875887': {
                  id: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: [
                    '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                    'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  ],
                  categories: [
                    'ca05ca36-805c-4f67-a097-a45988ba82d7',
                    '083adb66-0288-4148-b0ca-ec61f99970a6',
                    '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  ],
                  activityTypes: [
                    '1982f070-704c-4054-beb4-ea188399fc10',
                    '810eca68-a948-4646-93b8-09a02d1626a1',
                    'bc577f78-bf74-4a2e-88c2-553066074dee',
                    '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                  ],
                },
              },
            },
            session: {
              entities: {
                '997a5210-33d1-4198-a4a4-5f1ea477cc01': {
                  id: '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activityInstances: [
                    'c72cea78-2027-4615-a6a1-3daca28c9bba',
                    'bf843d19-c4aa-4f18-84dd-105a45ff14c7',
                  ],
                },
                'bdcf6a74-e2e7-47f7-af8f-1c66042e119e': {
                  id: 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activityInstances: [
                    '13800618-a022-4fbb-a6ad-7ba94f93b221',
                    '67c120ef-7420-4b2e-b8d2-53e52a85501d',
                  ],
                },
              },
            },
            activityInstance: {
              entities: {
                'c72cea78-2027-4615-a6a1-3daca28c9bba': {
                  'id': 'c72cea78-2027-4615-a6a1-3daca28c9bba',
                  'start': '2017-10-20T17:00:00.000-07:00',
                  'end': '2017-10-20T17:20:00.000-07:00',
                  'isComplete': true,
                  'session': '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  'category': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'activityType': '1982f070-704c-4054-beb4-ea188399fc10',
                },
                'bf843d19-c4aa-4f18-84dd-105a45ff14c7': {
                  'id': 'bf843d19-c4aa-4f18-84dd-105a45ff14c7',
                  'start': '2017-10-20T17:20:00.000-07:00',
                  'end': '2017-10-20T17:30:00.000-07:00',
                  'isComplete': true,
                  'session': '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  'category': '083adb66-0288-4148-b0ca-ec61f99970a6',
                  'activityType': '810eca68-a948-4646-93b8-09a02d1626a1',
                },
                '13800618-a022-4fbb-a6ad-7ba94f93b221': {
                  'id': '13800618-a022-4fbb-a6ad-7ba94f93b221',
                  'start': '2017-10-20T17:30:00.000-07:00',
                  'end': '2017-10-20T17:40:00.000-07:00',
                  'isComplete': true,
                  'session': 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  'category': '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  'activityType': 'bc577f78-bf74-4a2e-88c2-553066074dee',

                },
                '67c120ef-7420-4b2e-b8d2-53e52a85501d': {
                  'id': '67c120ef-7420-4b2e-b8d2-53e52a85501d',

                  // Missing scalar field
                  // 'start': '2017-10-20T17:40:00.000-07:00',
                  'end': '2017-10-20T17:55:00.000-07:00',
                  'isComplete': true,
                  'session': 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  'category': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'activityType': '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                },
              },
            },
            activityType: {
              entities: {
                '1982f070-704c-4054-beb4-ea188399fc10': {
                  id: '1982f070-704c-4054-beb4-ea188399fc10',
                  name: 'Write seed data',
                  activityCount: 6,
                  // category_name: 'CODE',
                  category: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                '810eca68-a948-4646-93b8-09a02d1626a1': {
                  id: '810eca68-a948-4646-93b8-09a02d1626a1',
                  name: 'Lunch',
                  activityCount: 3,
                  // category_name: 'EAT',
                  category: '083adb66-0288-4148-b0ca-ec61f99970a6',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                'bc577f78-bf74-4a2e-88c2-553066074dee': {
                  id: 'bc577f78-bf74-4a2e-88c2-553066074dee',
                  name: 'Poop',
                  activityCount: 3,
                  // category_name: 'POTTY',
                  category: '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                '7fc5ca14-1fec-4bf8-aba3-02a87880424e': {
                  id: '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                  name: 'Write test cases',
                  activityCount: 3,
                  // category_name: 'CODE',
                  category: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
              },
            },
            category: {
              entities: {
                'ca05ca36-805c-4f67-a097-a45988ba82d7': {
                  'id': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'color': '#3E416A',
                  'name': 'CODE'
                },
                '083adb66-0288-4148-b0ca-ec61f99970a6': {
                  'id': '083adb66-0288-4148-b0ca-ec61f99970a6',
                  'color': '#E9696A',
                  'name': 'EAT'
                },
                '51d017c1-57f1-401c-a16f-7f8142fb37d6': {
                  'id': '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  'color': '#BBD8CB',
                  'name': 'POTTY'
                },
              },
            },
          },
        }
      );

      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });
  
    it('should return false with a store missing a single entity instance', () => {
      const initialStoreState = _.merge(
        {},
        initialState,
        {
          entities: {
            user: {
              entities: {
                'cb39dbb5-caa8-4323-93a5-13450b875887': {
                  id: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                  username: 'the hugest',
                  email: 'hugeeuge@gmail.com',
                  password: 'password',
                  sessions: [
                    '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                    'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  ],
                  categories: [
                    'ca05ca36-805c-4f67-a097-a45988ba82d7',
                    '083adb66-0288-4148-b0ca-ec61f99970a6',
                    '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  ],
                  activityTypes: [
                    '1982f070-704c-4054-beb4-ea188399fc10',
                    '810eca68-a948-4646-93b8-09a02d1626a1',
                    'bc577f78-bf74-4a2e-88c2-553066074dee',
                    '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                  ],
                },
              },
            },
            session: {
              entities: {
                '997a5210-33d1-4198-a4a4-5f1ea477cc01': {
                  id: '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  name: 'Study Session 1',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activityInstances: [
                    'c72cea78-2027-4615-a6a1-3daca28c9bba',
                    'bf843d19-c4aa-4f18-84dd-105a45ff14c7',
                  ],
                },
                'bdcf6a74-e2e7-47f7-af8f-1c66042e119e': {
                  id: 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activityInstances: [
                    '13800618-a022-4fbb-a6ad-7ba94f93b221',
                    '67c120ef-7420-4b2e-b8d2-53e52a85501d',
                  ],
                },
              },
            },
            activityInstance: {
              entities: {
                'c72cea78-2027-4615-a6a1-3daca28c9bba': {
                  'id': 'c72cea78-2027-4615-a6a1-3daca28c9bba',
                  'start': '2017-10-20T17:00:00.000-07:00',
                  'end': '2017-10-20T17:20:00.000-07:00',
                  'isComplete': true,
                  'session': '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  'category': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'activityType': '1982f070-704c-4054-beb4-ea188399fc10',
                },
                'bf843d19-c4aa-4f18-84dd-105a45ff14c7': {
                  'id': 'bf843d19-c4aa-4f18-84dd-105a45ff14c7',
                  'start': '2017-10-20T17:20:00.000-07:00',
                  'end': '2017-10-20T17:30:00.000-07:00',
                  'isComplete': true,
                  'session': '997a5210-33d1-4198-a4a4-5f1ea477cc01',
                  'category': '083adb66-0288-4148-b0ca-ec61f99970a6',
                  'activityType': '810eca68-a948-4646-93b8-09a02d1626a1',
                },
                '13800618-a022-4fbb-a6ad-7ba94f93b221': {
                  'id': '13800618-a022-4fbb-a6ad-7ba94f93b221',
                  'start': '2017-10-20T17:30:00.000-07:00',
                  'end': '2017-10-20T17:40:00.000-07:00',
                  'isComplete': true,
                  'session': 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  'category': '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  'activityType': 'bc577f78-bf74-4a2e-88c2-553066074dee',

                },
                '67c120ef-7420-4b2e-b8d2-53e52a85501d': {
                  'id': '67c120ef-7420-4b2e-b8d2-53e52a85501d',
                  'start': '2017-10-20T17:40:00.000-07:00',
                  'end': '2017-10-20T17:55:00.000-07:00',
                  'isComplete': true,
                  'session': 'bdcf6a74-e2e7-47f7-af8f-1c66042e119e',
                  'category': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'activityType': '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                },
              },
            },
            activityType: {
              entities: {
                '1982f070-704c-4054-beb4-ea188399fc10': {
                  id: '1982f070-704c-4054-beb4-ea188399fc10',
                  name: 'Write seed data',
                  activityCount: 6,
                  // category_name: 'CODE',
                  category: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                '810eca68-a948-4646-93b8-09a02d1626a1': {
                  id: '810eca68-a948-4646-93b8-09a02d1626a1',
                  name: 'Lunch',
                  activityCount: 3,
                  // category_name: 'EAT',
                  category: '083adb66-0288-4148-b0ca-ec61f99970a6',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },
                'bc577f78-bf74-4a2e-88c2-553066074dee': {
                  id: 'bc577f78-bf74-4a2e-88c2-553066074dee',
                  name: 'Poop',
                  activityCount: 3,
                  // category_name: 'POTTY',
                  category: '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                },

                // Missing entity
                // '7fc5ca14-1fec-4bf8-aba3-02a87880424e': {
                //   id: '7fc5ca14-1fec-4bf8-aba3-02a87880424e',
                //   name: 'Write test cases',
                //   activityCount: 3,
                //   // category_name: 'CODE',
                //   category: 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                //   user: 'cb39dbb5-caa8-4323-93a5-13450b875887',
                // },
              },
            },
            category: {
              entities: {
                'ca05ca36-805c-4f67-a097-a45988ba82d7': {
                  'id': 'ca05ca36-805c-4f67-a097-a45988ba82d7',
                  'color': '#3E416A',
                  'name': 'CODE'
                },
                '083adb66-0288-4148-b0ca-ec61f99970a6': {
                  'id': '083adb66-0288-4148-b0ca-ec61f99970a6',
                  'color': '#E9696A',
                  'name': 'EAT'
                },
                '51d017c1-57f1-401c-a16f-7f8142fb37d6': {
                  'id': '51d017c1-57f1-401c-a16f-7f8142fb37d6',
                  'color': '#BBD8CB',
                  'name': 'POTTY'
                },
              },
            },
          },
        }
      );

      const store = createStore(reducer, initialStoreState);
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });
  });
});