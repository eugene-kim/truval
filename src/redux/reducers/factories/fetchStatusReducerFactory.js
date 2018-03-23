import _ from 'src/libs/dash';

import {
  hydrateFetchStatuses,
  deleteEntityFetchStatus,
  setEntityFetchStatus,
} from '../commonReducers/fetchStatusReducers';
import {FAILED, LOADING, LOADED, UPDATING, DELETING} from '../fetchStatus';
import {UPDATE_FROM_SERVER} from '../../actions/types';


const fetchStatusReducerFactory = ({entityType, fetchStatuses = {}, action}) => {
  const entityTypeCaps = _.toSnakeUpper(entityType);
  const {type, payload} = action;

  const createEntitySuccess = `CREATE_${entityTypeCaps}_SUCCESS`;
  const updateEntityRequest = `UPDATE_${entityTypeCaps}_REQUEST`;
  const updateEntitySuccess = `UPDATE_${entityTypeCaps}_SUCCESS`;
  const updateEntityFailure = `UPDATE_${entityTypeCaps}_FAILURE`;
  const deleteEntityRequest = `DELETE_${entityTypeCaps}_REQUEST`;
  const deleteEntitySuccess = `DELETE_${entityTypeCaps}_SUCCESS`;
  const deleteEntityFailure = `DELETE_${entityTypeCaps}_FAILURE`;

  // addEntity and removeEntity are special cases for when adding / removing
  // an entity does not require an asynchronous network request.
  const addEntity = `ADD_${entityTypeCaps}`;
  const removeEntity = `REMOVE_${entityTypeCaps}`;

  switch(type) {
    case createEntitySuccess: {
      const entity = payload[entityType];
      const {id} = entity;

      return setEntityFetchStatus(id, LOADED)(fetchStatuses);
    }
    case updateEntityRequest: {
      const {id} = payload;

      return setEntityFetchStatus(id, UPDATING)(fetchStatuses);
    }
    case updateEntitySuccess: {
      const {id} = payload;

      return setEntityFetchStatus(id, LOADED)(fetchStatuses);
    }
    case updateEntityFailure: {
      const {id} = payload;

      return setEntityFetchStatus(id, FAILED)(fetchStatuses);
    }
    case deleteEntityRequest: {
      const {id} = payload;

      return setEntityFetchStatus(id, DELETING)(fetchStatuses);
    }
    case deleteEntitySuccess: {
      const {id} = payload;

      return deleteEntityFetchStatus(id)(fetchStatuses);
    }
    case deleteEntityFailure: {
      return setEntityFetchStatus(id, FAILED)(fetchStatuses);
    }
    case addEntity: {
      const entity = payload[entityType];
      const {id} = entity;
      
      return setEntityFetchStatus(id, LOADED)(fetchStatuses);
    }
    case removeEntity: {
      const {id} = payload;

      return deleteEntityFetchStatus(id)(fetchStatuses);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateFetchStatuses({action, entityType, fetchStatuses});
    }
    default:
      return fetchStatuses;
  }
};


export default fetchStatusReducerFactory;