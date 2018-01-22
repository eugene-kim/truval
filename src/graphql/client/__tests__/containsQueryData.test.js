import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {parse} from 'graphql/language/parser';
import {createStore} from 'redux';
import _ from 'lodash';

import gqlSchema from '../../schema';
import containsQueryData from '../containsQueryData';
import initialState from '../../../../redux/store/initialState';
import reducer from '../../../../redux/reducers';

describe('test containsQueryData()', () => {
  let schemaDocumentWhole;
  let schemaDoc;

  beforeEach(async () => {
    schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
    schemaDoc = schemaDocumentWhole.data.__schema;
  });

  describe('none nested query asking for a user with id: 1', () => {
    set('query', () => {
      return `
        query {
          user(id: 1) {
            id
          }
        }
      `;
    });
    set('queryAST', () => parse(query));
    set('initialStoreState', () => initialState);
    set('store', () => createStore(reducer, initialStoreState));

    it('should return false with an empty store', () => {
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false with a store containing a single user but with id: 2', () => {
      set('initialStoreState', () => {
        return _.merge(
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
          },
        );
      });

      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return false with a store containing no users but an activity', () => {
      set('initialStoreState', () => {
        return _.merge(
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
          },
        );
      });

      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(false);
    });

    it('should return true with a store containing a user with id: 1', () => {
      set('initialStoreState', () => {
        return _.merge(
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
          },
        );
      });
      const storeContainsData = containsQueryData(queryAST, schemaDoc, store);

      expect(storeContainsData).toBe(true);
    });
  });
});