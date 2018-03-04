import _ from 'libs/dash';
import {FAILED, LOADING, LOADED} from '../fetchStatus';


const reduceNewEntityFetchStatus = entityName => (newFetchStatus = '', action) => {
  const {type} = action;
  const entityNameCaps = _.toSnakeUpper(entityName);
  const createEntityRequest = `CREATE_${entityNameCaps}_REQUEST`;
  const createEntitySuccess = `CREATE_${entityNameCaps}_SUCCESS`;
  const createEntityFailure = `CREATE_${entityNameCaps}_FAILURE`;

  switch(type) {
    case createEntityRequest: {
      return LOADING;
    }
    case createEntitySuccess: {
      return LOADED;
    }
    case createEntityFailure: {
      return FAILED;
    }
    default:
      return newFetchStatus;
  }
};


export default reduceNewEntityFetchStatus;