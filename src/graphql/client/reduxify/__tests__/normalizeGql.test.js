// Module imports
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {parse} from 'graphql/language/parser';
import {schema} from 'normalizr';
import _ from 'lodash';
import util from 'util';

// Local imports
import normalizeGql from '../normalizeGql';
import gqlSchema from 'graphql/schema/typeDefSchema';


let schemaDocumentWhole;
let schemaDoc;

beforeAll(async () => {
  schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
  schemaDoc = schemaDocumentWhole.data.__schema;
});

describe('test normalizeGql', () => {
  describe('valid queries', () => {
    it('single level query', () => {
      const query = `
        query {
          user(id:1) {
            id,
            username
          }
        }`;
      const queryAST = parse(query);
      const resultNormalizrSchema = normalizeGql(queryAST, schemaDoc);
      const resultSchemaString = JSON.stringify(resultNormalizrSchema);
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user'),
        },
      };
      const expectedSchemaString = JSON.stringify(expectedNormalizrSchema);

      expect(resultSchemaString === expectedSchemaString).toBe(true);
    });

    it('single nested query', () => {
      const query = `
        query {
          user(id:1) {
            id,
            username,
            sessions {
              id,
              name
            }
          }
        }`;
      const queryAST = parse(query);
      const resultNormalizrSchema = normalizeGql(queryAST, schemaDoc);
      const sessionsSchema = new schema.Entity('sessions');
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user', {
            sessions: new schema.Array(sessionsSchema),
          }),
        },
      };

      const resultSchemaString = JSON.stringify(resultNormalizrSchema);
      const expectedSchemaString = JSON.stringify(expectedNormalizrSchema);

      expect(resultSchemaString === expectedSchemaString).toBe(true);
    });

    it('five level nested query with circular reference', () => {
      const query = `query {
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
      const queryAST = parse(query);
      const resultNormalizrSchema = normalizeGql(queryAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user', {
            sessions: new schema.Array(new schema.Entity('sessions', {
              activities: new schema.Array(new schema.Entity('activities', {
                session: new schema.Entity('session', {
                  activities: new schema.Array(new schema.Entity('activities')),
                }),
                category: new schema.Entity('category'),
              })),
            })),
          }),
        }
      };
      const resultSchemaString = JSON.stringify(resultNormalizrSchema);
      const expectedSchemaString = JSON.stringify(expectedNormalizrSchema);

      expect(resultSchemaString === expectedSchemaString).toBe(true);
    });
  });

  describe('valid mutations', () => {
    it('single level mutation', () => {
      const mutation = `mutation {
        updateUser(id:1, username:"the hugest") {
          id,
          username,
        }
      }`;
      const mutationAST = parse(mutation);
      const resultNormalizrSchema = normalizeGql(mutationAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          updateUser: new schema.Entity('updateUser'),
        },
      };
      const resultSchemaString = JSON.stringify(resultNormalizrSchema);
      const expectedSchemaString = JSON.stringify(expectedNormalizrSchema);

      expect(resultSchemaString === expectedSchemaString).toBe(true);
    });

    it('single nested mutation', () => {
      const mutation = `mutation {
        updateUser(id:1, username:"the hugest") {
          id,
          username,
          sessions {
            id,
            name,
            start,
          }
        }
      }`;
      const mutationAST = parse(mutation);
      const resultNormalizrSchema = normalizeGql(mutationAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          updateUser: new schema.Entity('updateUser', {
            sessions: new schema.Array(new schema.Entity('sessions')),
          }),
        },
      };
      const resultSchemaString = JSON.stringify(resultNormalizrSchema);
      const expectedSchemaString = JSON.stringify(expectedNormalizrSchema);

      expect(resultSchemaString === expectedSchemaString).toBe(true);
    });

    it('double nested mutation', () => {
      const mutation = `mutation {
        updateUser(id:1, username:"the hugest") {
          id,
          username,
          sessions {
            id,
            name,
            start,
            activities {
              id,
              name
            }
          }
        }
      }`;
      const mutationAST = parse(mutation);
      const resultNormalizrSchema = normalizeGql(mutationAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          updateUser: new schema.Entity('updateUser', {
            sessions: new schema.Array(new schema.Entity('sessions', {
              activities: new schema.Array(new schema.Entity('activities')),
            })),
          }),
        },
      };
      const resultSchemaString = JSON.stringify(resultNormalizrSchema);
      const expectedSchemaString = JSON.stringify(expectedNormalizrSchema);

      expect(resultSchemaString === expectedSchemaString).toBe(true);
    });
  });

  describe('invalid queries / mutations', () => {
    describe('queries without id fields', () => {
      it('non nested query without an id throws an error', () => {
        const query = `
          query {
            user(id:1) {
              username
            }
          }`;
        const queryAST = parse(query);

        expect(() => {normalizeGql(queryAST, schemaDoc)}).toThrow();
      });

      it('single nested query without an id throws an error', () => {
        const query = `
          query {
            user(id:1) {
              id,
              username,
              sessions {
                name
              }
            }
          }`;
        const queryAST = parse(query);

        expect(() => {normalizeGql(queryAST, schemaDoc)}).toThrow();
      });
    });

    describe('mutations without id fields', () => {
      it('non nested mutation without an id throws an error', () => {
        const mutation = `
          mutation {
            updateUser(id:1, username:"the hugest") {
              username,
            }
          }`;
        const mutationAST = parse(mutation);

        expect(() => {normalizeGql(mutationAST, schemaDoc)}).toThrow();
      });

      it('single nested mutation without an id throws an error', () => {
        const mutation = `
          mutation {
            updateUser(id:1, username:"the hugest") {
              id,
              username,
              sessions {
                name,
                start,
              }
            }
          }`;
        const mutationAST = parse(mutation);

        expect(() => {normalizeGql(mutationAST, schemaDoc)}).toThrow();
      });
    });
  });
});