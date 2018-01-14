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
  it('single level query', async () => {
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

  it('test single nested query', async () => {
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

  // it('test five level nested query with circular reference', async () => {

  // });

  describe('operations without ids throw an error', () => {
    it('query without an id throws an error', async () => {
      const query = `
        query {
          user(id:1) {
            username
          }
        }`;
      const queryAST = parse(query);

      expect(() => {createNormalizrSchema(queryAST, schemaDoc)}).toThrow();
    });

    it('nested query without an id throws an error', async () => {
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