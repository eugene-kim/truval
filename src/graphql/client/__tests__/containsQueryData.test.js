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

  describe('4 level nested query with circular references requesting `user(id: 1)`', () => {
    set('query', () => {
      return `
        query {
          user(id:1) {
            id,
            username,
            email,
            password,
            sessions {
              id,
              name,
              start,
              isComplete,
              activities {
                id,
                start,
                end,
                isComplete,
                session {
                  id,
                  start,
                  end,
                  isComplete,
                  activities {
                    id,
                    start,
                    end,
                  }
                },
                category {
                  id,
                  color,
                  name
                }
              }
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
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [1,2],
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [3,4],
                },
                '3': {
                  id: '3',
                  name: 'Study Session 3',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [5,6],
                },
              },
            },
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
                '2': {
                  'id': '2',
                  'start': '2017-10-20T17:20:00.000-07:00',
                  'end': '2017-10-20T17:30:00.000-07:00',
                  'isComplete': true,
                  'session': '1',
                  'category': '2'
                },
                '3': {
                  'id': '3',
                  'start': '2017-10-20T17:30:00.000-07:00',
                  'end': '2017-10-20T17:40:00.000-07:00',
                  'isComplete': true,
                  'session': '2',
                  'category': '3'
                },
                '4': {
                  'id': '4',
                  'start': '2017-10-20T17:40:00.000-07:00',
                  'end': '2017-10-20T17:55:00.000-07:00',
                  'isComplete': true,
                  'session': '2',
                  'category': '1'
                },
                '5': {
                  'id': '5',
                  'start': '2017-10-20T17:55:00.000-07:00',
                  'end': '2017-10-20T18:40:00.000-07:00',
                  'isComplete': true,
                  'session': '3',
                  'category': '2'
                },
                '6': {
                  'id': '6',
                  'start': '2017-10-20T18:40:00.000-07:00',
                  'end': '2017-10-20T19:40:00.000-07:00',
                  'isComplete': true,
                  'session': '3',
                  'category': '3'
                },
              },
            },
            category: {
              entities: {
                '1': {
                  'id': '1',
                  'color': '#3E416A',
                  'name': 'CODE'
                },
                '2': {
                  'id': '2',
                  'color': '#E9696A',
                  'name': 'EAT'
                },
                '3': {
                  'id': '3',
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
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [1,2],
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [3,4],
                },
                '3': {
                  id: '3',
                  name: 'Study Session 3',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [5,6],
                },
              },
            },
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
                '2': {
                  'id': '2',
                  'start': '2017-10-20T17:20:00.000-07:00',
                  'end': '2017-10-20T17:30:00.000-07:00',
                  'isComplete': true,
                  'session': '1',
                  'category': '2'
                },
                '3': {
                  'id': '3',
                  'start': '2017-10-20T17:30:00.000-07:00',
                  'end': '2017-10-20T17:40:00.000-07:00',
                  'isComplete': true,
                  'session': '2',
                  'category': '3'
                },
                '4': {
                  'id': '4',
                  'start': '2017-10-20T17:40:00.000-07:00',
                  'end': '2017-10-20T17:55:00.000-07:00',
                  'isComplete': true,
                  'session': '2',
                  'category': '1'
                },
                '5': {
                  'id': '5',
                  'start': '2017-10-20T17:55:00.000-07:00',
                  'end': '2017-10-20T18:40:00.000-07:00',
                  'isComplete': true,
                  'session': '3',
                  'category': '2'
                },
                '6': {
                  'id': '6',
                  'start': '2017-10-20T18:40:00.000-07:00',
                  'end': '2017-10-20T19:40:00.000-07:00',
                  'isComplete': true,
                  'session': '3',
                  'category': '3'
                },
              },
            },
            category: {
              entities: {
                '1': {
                  'id': '1',
                  'color': '#3E416A',
                  'name': 'CODE'
                },
                '2': {
                  'id': '2',

                  // Missing scalar field
                  // 'color': '#E9696A',
                  'name': 'EAT'
                },
                '3': {
                  'id': '3',
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
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [1,2],
                },
                '2': {
                  id: '2',
                  name: 'Study Session 2',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [3,4],
                },
                '3': {
                  id: '3',
                  name: 'Study Session 3',
                  start: '2017-10-21T15:51:09.489-07:00',
                  end: '2017-10-21T15:51:09.489-07:00',
                  isComplete: false,
                  activities: [5,6],
                },
              },
            },
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
                '2': {
                  'id': '2',
                  'start': '2017-10-20T17:20:00.000-07:00',
                  'end': '2017-10-20T17:30:00.000-07:00',
                  'isComplete': true,
                  'session': '1',
                  'category': '2'
                },
                '3': {
                  'id': '3',
                  'start': '2017-10-20T17:30:00.000-07:00',
                  'end': '2017-10-20T17:40:00.000-07:00',
                  'isComplete': true,
                  'session': '2',
                  'category': '3'
                },
                '4': {
                  'id': '4',
                  'start': '2017-10-20T17:40:00.000-07:00',
                  'end': '2017-10-20T17:55:00.000-07:00',
                  'isComplete': true,
                  'session': '2',
                  'category': '1'
                },
                '5': {
                  'id': '5',
                  'start': '2017-10-20T17:55:00.000-07:00',
                  'end': '2017-10-20T18:40:00.000-07:00',
                  'isComplete': true,
                  'session': '3',
                  'category': '2'
                },
                '6': {
                  'id': '6',
                  'start': '2017-10-20T18:40:00.000-07:00',
                  'end': '2017-10-20T19:40:00.000-07:00',
                  'isComplete': true,
                  'session': '3',
                  'category': '3'
                },
              },
            },
            category: {
              entities: {
                '1': {
                  'id': '1',
                  'color': '#3E416A',
                  'name': 'CODE'
                },
                '2': {
                  'id': '2',
                  'color': '#E9696A',
                  'name': 'EAT'
                },

                // Missing entity!
                // '3': {
                //   'id': '3',
                //   'color': '#BBD8CB',
                //   'name': 'POTTY'
                // },
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