// Module imports
const {graphql} = require('graphql');
const {introspectionQuery} = require('graphql/utilities');
const {parse} = require('graphql/language/parser');
const {schema} = require('normalizr');
const _ = require('lodash');

const util = require('util');

// Local imports
const createNormalizrSchema = require('../createNormalizrSchema');
const gqlSchema = require('../../../schema');

let schemaDocumentWhole;
let schemaDoc;

beforeAll(async () => {
  schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
  schemaDoc = schemaDocumentWhole.data.__schema;
});

describe('test createNormalizrSchema', () => {
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
      const resultNormalizrSchema = createNormalizrSchema(queryAST, schemaDoc);
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
      const resultNormalizrSchema = createNormalizrSchema(queryAST, schemaDoc);
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
      const resultNormalizrSchema = createNormalizrSchema(queryAST, schemaDoc);
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
      const resultNormalizrSchema = createNormalizrSchema(mutationAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user'),
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
      const resultNormalizrSchema = createNormalizrSchema(mutationAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user', {
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
      const resultNormalizrSchema = createNormalizrSchema(mutationAST, schemaDoc);
      const expectedNormalizrSchema = {
        data: {
          user: new schema.Entity('user', {
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

  describe('invalid queries', () => {
    describe('queries without id fields', () => {
      it('non nested query without an id throws an error', () => {
        const query = `
          query {
            user(id:1) {
              username
            }
          }`;
        const queryAST = parse(query);

        expect(() => {createNormalizrSchema(queryAST, schemaDoc)}).toThrow();
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

        expect(() => {createNormalizrSchema(queryAST, schemaDoc)}).toThrow();
      });
    });
  });
});