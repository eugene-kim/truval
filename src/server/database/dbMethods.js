import _ from 'lodash';
import knex from './index';


/**
 * Creates an instance of a GraphQL Type in Postgres and returns the newly
 * created object.
 */
const createModelInstance = (requiredParams, optionalParams, tableName, columnNames) => {
  optionalParams = removeUndefinedProperties(optionalParams);
  const newModelInstance = _.merge(requiredParams, optionalParams);

  return knex(tableName).insert(newModelInstance).returning(columnNames)
  .then(dbResults => {

      // .insert() returns an array of objects based on what is passed to .returning()
      // and how many objects we're inserting.
      // We're inserting one object with createModelInstance(), so we retrieve from index 0.
      const dbResult = dbResults[0];
      const response = toCamelCaseKeys(dbResult);

      return response;
  })
  .catch(error => console.log(error));
}

/**1
 * Updates an already existing instance of a GraphQL type in Postgres and
 * returns the updated object.
 */
const updateModelInstance = (mutationParams, tableName, columnNames) => {
  const id = mutationParams.id;
  const dbPropertiesToUpdate = makeDbCompatible(mutationParams);

  return knex(tableName)
  .update(dbPropertiesToUpdate).where('id', '=', id).returning(columnNames)
  .then(dbResults => {
    const dbResult = dbResults[0];

    console.log(dbResult);

    return toCamelCaseKeys(dbResult);
  })
  .catch(error => console.log(error));
}

const getModelInstance = (keyValue, tableName, keyName='id') => {
  return knex(tableName).first().where(keyName, '=', keyValue)
  .then(tableRow => toCamelCaseKeys(tableRow))
  .catch(error => console.log(error));
}

const getModelInstances = (foreignKeyValue, foreignKeyName, tableName) => {
  return knex(tableName).select().where(foreignKeyName, '=', foreignKeyValue)
  .then(rows => rows.map(row => toCamelCaseKeys(row)))
  .catch(error => console.log(error));
}

const deleteModelInstance = (id, tableName) => {
  return knex(tableName).del().where('id', '=', id)
  .catch(error => console.log(error));
}

/**
 * This method outputs an object with snake_case property names and removes
 * any properties that have undefined values.
 */
const makeDbCompatible = object => {

  // Whenever inserting or updating into the database, we shouldn't be fiddling
  // around with the object id.
  delete object.id;

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
const toCamelCaseKeys = object => _.mapKeys(object, (value, key) => _.camelCase(key));

/**
 * Returns an object whose keys are in snake case.
 *
 * Useful when formatting an object to be put into Postgres.
 */
const toSnakeCaseKeys = object => _.mapKeys(object, (value, key) => _.snakeCase(key));


export default {
  createModelInstance,
  updateModelInstance,
  getModelInstance,
  getModelInstances,
  deleteModelInstance,
};