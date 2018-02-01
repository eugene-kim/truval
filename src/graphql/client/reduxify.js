import _ from 'lodash';
import astReader from './astReader';
import pluralize from 'pluralize';
import {renameKey} from '~/libs/util/objectUtil';


/**
 * normalizeGql() doesn't make any assumptions about the query and the data coming in.
 * This is good in that it's not prescriptive, but the normalized data then needs to
 * be adjusted so that it can be put into our Redux store.
 * Entity names such as `createUser` need to be converted to its singular entity type name.
 * In this case, `createUser` will become `user`. Should a user entity already exist,
 * we'll merge the two objects.`
 */
const reduxify = (normalizedGqlResponse, operationAST, schemaDoc) => {  
  const reduxFriendlyData = Object.assign({}, normalizedGqlResponse);
  const {entities} = reduxFriendlyData;

  // Rename all root field names into Redux friendly names.
  const operationName = astReader.getOperationName(operationAST);
  const rootFieldNames = astReader.getOperationRootFieldNames(operationAST);
  const rootFieldNameTypes = rootFieldNames.map(rootFieldName => ({
    name: rootFieldName,
    type: astReader.getOperationFieldType(operationName, rootFieldName, schemaDoc),
  }));

  rootFieldNameTypes.map(rootFieldNameType => {
    const {name, type} = rootFieldNameType;
    const reduxEntityName = getReduxEntityName(type);

    renameKey(entities, name, reduxEntityName);
  });

  // Make all plural entity keys singular.
  // If both singular and plural keys exist, merge plural into singular.
  Object.keys(entities).map(key => {
    if (pluralize.isPlural(key)) {
      const reduxEntityName = getReduxEntityName(key);

      if (entities.hasOwnProperty(reduxEntityName)) {
        const reduxEntities = entities[reduxEntityName];
        const pluralEntities = entities[key];

        entities[reduxEntityName] = _.merge({}, pluralEntities, reduxEntities);

        delete entities[key];
      } else { // Only plural key exists. Simply rename the property on the object.
        renameKey(entities, key, reduxEntityName);
      }
    }
  });

  return reduxFriendlyData;
}

/**
 * Formats a String to be lowercase and singular.
 * 
 * This is useful when accessing our redux store since a GraphQL type can be represented in multiple ways
 * (e.g. get a single session with `session` or get all of a user's sessions via `sessions`) while
 * an entity in our Redux store will exist in a single location.
 */
export const getReduxEntityName = name => pluralize.singular(_.toLower(name));

export default reduxify;