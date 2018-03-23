import _ from 'src/libs/dash';
import {FAILED, LOADING, LOADED} from '../fetchStatus';


const reduceNewEntityFetchStatus = ({entityType, newFetchStatus, action}) => {
  const {type} = action;
  const entityTypeCaps = _.toSnakeUpper(entityType);
  const createEntityRequest = `CREATE_${entityTypeCaps}_REQUEST`;
  const createEntitySuccess = `CREATE_${entityTypeCaps}_SUCCESS`;
  const createEntityFailure = `CREATE_${entityTypeCaps}_FAILURE`;

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