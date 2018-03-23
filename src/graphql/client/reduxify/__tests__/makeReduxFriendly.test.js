// Module imports
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {parse} from 'graphql/language/parser';
import _ from 'src/libs/dash';

// Local imports
import makeReduxFriendly from '../makeReduxFriendly';
import gqlSchema from 'src/graphql/schema/typeDefSchema';
import normalizedQueryData from './resources/normalizedQueryData';
import normalizedMutationData from './resources/normalizedMutationData';


describe('test makeReduxFriendly', () => {
  let schemaDocumentWhole;
  let schemaDoc;

  beforeEach(async () => {
    schemaDocumentWhole = await graphql(gqlSchema, introspectionQuery);
    schemaDoc = schemaDocumentWhole.data.__schema;
  });

  describe('with nested query requesting for both sessions and session', () => {
    set('query', () => {
      return `query {
        user(id:1) {
          id,
          username,
          email,
          password,
          sessions {
            id,
            name,
            start,
            activityInstances {
              id,
              isComplete,
              session {
                id,
                end,
                isComplete,
                activityInstances {
                  id,
                  start,
                  end,
                }
              },
            }
          }
        }
      }`
    });
    set('queryAST', () => parse(query));
    set('reduxFriendlyData', () => makeReduxFriendly(normalizedQueryData, queryAST, schemaDoc));
    set('entities', () => reduxFriendlyData.entities);

    it('plural key sessions doesn\'t exist in reduxified data', () => {
      expect(entities.hasOwnProperty('sessions')).toBe(false);
    });

    // `session` only contains 3 instances in the normalized data.
    // `sessions` contains those 3 instance plus 3 additional ones that aren't associated with an activity.
    it('session contains all instances of the session that were previously under `sessions`', () => {
      expect(Object.keys(entities.session).length).toBe(6);
    });

    // It's possible for a GraphQL request to ask for different scalar fields for the same GraphQL
    // schema type (refer to `query` variable above). This test verifies that the same entity instance
    // retrieved via different means (e.g. an instance of `Session` with id 1 that exists in th
    // normalized data under `sessions` AND `session` now exists under `session` and contains all
    // properties from both `session` and `sessions`).
    it('merged session instance contains properties from both `sessions` and `session`', () => {
      const sessionOne = entities.session['1'];

      // `isComplete` only exists under the instance under `sessions`.
      expect(sessionOne.hasOwnProperty('isComplete')).toBe(true);

      // `name` only exists under the instance under `session`.
      expect(sessionOne.hasOwnProperty('name')).toBe(true);
    });
  });

  describe('with mutation with root field updateUser', () => {
    set('mutation', () => {
      return `mutation {
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
      }`
    });
    set('mutationAST', () => parse(mutation));
    set('reduxFriendlyData', () => makeReduxFriendly(normalizedMutationData, mutationAST, schemaDoc));
    set('entities', () => reduxFriendlyData.entities);

    it('updateUser property has been replaced with redux entity name `user`', () => {
      expect(entities.hasOwnProperty('updateUser')).toBe(false);
      expect(entities.hasOwnProperty('user')).toBe(true);

      const updateUserValue = normalizedMutationData.entities.updateUser;
      const userValue = entities.user;

      expect(_.isEqual(updateUserValue, userValue)).toBe(true);
    });
  });
});