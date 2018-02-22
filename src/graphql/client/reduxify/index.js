import _ from 'lodash';
import pluralize from 'pluralize';
import { normalize } from 'normalizr';

import normalizeGql from './normalizeGql';
import makeReduxFriendly from './makeReduxFriendly';


const reduxify = async (gqlResponse, operationAST, schemaDoc) => {
  const normalizrSchema = await normalizeGql(operationAST, schemaDoc);
  const normalizedData = normalize(gqlResponse, normalizrSchema);
  const reduxFriendlyData = makeReduxFriendly(normalizedData, operationAST, schemaDoc);

  return reduxFriendlyData;
};

/**
 * Formats a String to be lowercase and singular.
 * 
 * This is useful when accessing our redux store since a GraphQL type can be represented in multiple ways
 * (e.g. get a single session with `session` or get all of a user's sessions via `sessions`) while
 * an entity in our Redux store will exist in a single location.
 */
export const getReduxEntityName = name => pluralize.singular(_.camelCase(name));

export default reduxify;