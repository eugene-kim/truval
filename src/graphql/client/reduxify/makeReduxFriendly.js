import _ from 'lodash';
import pluralize from 'pluralize';

// Utility
import {renameKey} from 'src/libs/util/objectUtil';
import astReader from '../astReader';
import {getReduxEntityName} from '../reduxify';


/**
 * normalizeGql() doesn't make any assumptions about the query and the data coming in.
 * This is good in that it's not prescriptive, but the normalized data then needs to
 * be adjusted so that it can be put into our Redux store.
 * Entity names such as `createUser` need to be converted to its singular entity type name.
 * In this case, `createUser` will become `user`. Should a user entity already exist,
 * we'll merge the two objects.`
 */
const makeReduxFriendly = (normalizedGqlResponse, operationAST, schemaDoc) => {

  // TODO: If the normalized response is too big, we might want to use an immutable library
  // like Immutable.js to increase performance.
  const reduxFriendlyData = _.cloneDeep(normalizedGqlResponse);
  const {entities} = reduxFriendlyData;

  // Rename all root field names into Redux friendly names.
  const operationName = astReader.getOperationName(operationAST);
  const rootFieldNames = astReader.getOperationRootFieldNames(operationAST);
  const rootFieldNameTypes = rootFieldNames.map(rootFieldName => ({
    name: rootFieldName,
    type: astReader.getOperationRootFieldType(operationName, rootFieldName, schemaDoc),
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

      // plural and redux entity name exist. Merge the two together and delete plural key.
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


export default makeReduxFriendly;