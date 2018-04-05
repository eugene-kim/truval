import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import knex from './index';


/**
 * Creates an instance of a GraphQL Type in Postgres and returns the newly
 * created object.
 */
export const createModelInstance = async (requiredParams, optionalParams, tableName, columnNames) => {  
  const newModelInstance = _.merge(
    {},
    makeDbCompatible(requiredParams),
    makeDbCompatible(optionalParams),
    {id: uuidv4()},
  );

  try {
    const insertPromise = knex(tableName).insert(newModelInstance).returning(columnNames);
    const rows = await formatAndReturnQueryResult(insertPromise);

    // .insert() returns an array of objects based on what is passed to .returning()
    // and how many objects we're inserting.
    // We're inserting one object with createModelInstance(), so we retrieve from index 0.
    return rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Updates an already existing instance of a GraphQL type in Postgres and
 * returns the updated object.
 */
export const updateModelInstance = async (mutationParams, tableName, columnNames) => {
  try {
    const {id} = mutationParams;
    const dbPropertiesToUpdate = makeDbCompatible(mutationParams);
    const updatePromise = knex(tableName)
      .returning(columnNames)
      .update(dbPropertiesToUpdate)
      .where('id', id);

    const result = await formatAndReturnQueryResult(updatePromise);

    return result[0];
  } catch (error) {
    console.error(error);
    
    throw error;
  }
}

export const getModelInstance = async (matchProps, tableName) => {
  try {
    const dbFriendlyProps = makeDbCompatible(matchProps);
    const tableRow = await knex(tableName).first().where(dbFriendlyProps);

    return toCamelCaseKeys(tableRow);
  } catch (error) {
    throw error;
  }
}

export const getModelInstanceById = async (id, tableName) => {
  try {
    return getModelInstance({id}, tableName);
  } catch (error) {
    throw error;
  }
}

export const getModelInstances = async (foreignKeyValue, foreignKeyName, tableName) => {
  const queryPromise = knex(tableName).select().where(foreignKeyName, '=', foreignKeyValue);

  try {
    return await formatAndReturnQueryResult(queryPromise);
  } catch(error) {
    throw error;
  }
}

export const getOrderedModelInstances = async ({
  foreignKeyValue,
  foreignKeyName,
  tableName,
  orderByColumn,

  // 'ASC' is the default order set by Postgres.
  direction='asc',
}) => {
  const queryPromise = knex(tableName)
    .select()
    .where(foreignKeyName, '=', foreignKeyValue)
    .orderBy(orderByColumn, direction);

  try {
    return await formatAndReturnQueryResult(queryPromise);
  } catch(error) {
    throw error;
  }
}

const formatAndReturnQueryResult = async promise => {
  const result = await promise;

  if (result instanceof Array) {
    return result.map(row => toCamelCaseKeys(row));
  }

  return toCamelCaseKeys(result);
}

export const deleteModelInstance = async (id, tableName) => {
  try {
    return knex(tableName).del().where('id', id);
  } catch (error) {
    throw error;
  }
}

/**
 * This method outputs an object with snake_case property names and removes
 * any properties that have undefined values.
 */
const makeDbCompatible = object => {
  const objectWithDefinedValues = removeUndefinedProperties(object);

  return toSnakeCaseKeys(objectWithDefinedValues);
}

/**
 * Removes object properties that have undefined values.
 *
 * Useful when handling GraphQL queries that contain optional parameters.
 * When inserting or updating into the database, the resolver functions create an
 * object to be put into the database that include optional parameters, whether they
 * contain values or not. This results in undefined optional parameter values if
 * they haven't been provided. If they aren't removed prior to insertion / an update,
 * the database row will be updated with a `null` value instead of utilizing the table default.
 *
 * TODO: Find a home for this method.
 * TODO: Utilize immutable.js constructs.
 * TODO: Add tests.
 */
const removeUndefinedProperties = object => {
  if (!object || typeof object !== 'object') {
    return {};
  }

  Object.keys(object).forEach(
    key => _.isUndefined(object[key]) && delete object[key]
  );

  return object;
};

/**
 * Returns an object whose keys are in camel case.
 *
 * Useful when returning an object returned by Postgres that's in snake_case
 * into a properly formatted GraphQL response.
 */
export const toCamelCaseKeys = object => _.mapKeys(object, (value, key) => _.camelCase(key));

/**
 * Returns an object whose keys are in snake case.
 *
 * Useful when formatting an object to be put into Postgres.
 */
export const toSnakeCaseKeys = object => _.mapKeys(object, (value, key) => _.snakeCase(key));


export default {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstanceById,
  getModelInstances,
  deleteModelInstance,
};