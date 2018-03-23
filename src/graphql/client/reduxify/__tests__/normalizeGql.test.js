// Module imports
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {parse} from 'graphql/language/parser';
import {schema} from 'normalizr';
import _ from 'src/libs/dash';
import util from 'util';

// Local imports
import normalizeGql from '../normalizeGql';
import gqlSchema from 'src/graphql/schema/typeDefSchema';


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
      const query = `
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
                session {
                  id,
                  name,
                  activityInstances {
                    id,
                  }
                }
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
      const queryAST = parse(query);
      const resultNormalizrSchema = normalizeGql(queryAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user', {
            categories: new schema.Array(new schema.Entity('categories')),
            sessions: new schema.Array(new schema.Entity('sessions', {
              activityInstances: new schema.Array(new schema.Entity('activityInstances', {
                session: new schema.Entity('session', {
                  activityInstances: new schema.Array(new schema.Entity('activityInstances')),
                }),
                activityType: new schema.Entity('activityType', {
                  category: new schema.Entity('category'),
                }),
              })),
            })),
            activityTypes: new schema.Array(new schema.Entity('activityTypes')),
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
            activityInstances {
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
              activityInstances: new schema.Array(new schema.Entity('activityInstances')),
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