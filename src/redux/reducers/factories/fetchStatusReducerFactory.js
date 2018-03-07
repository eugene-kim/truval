import _ from 'libs/dash';

import {
  hydrateFetchStatuses,
  deleteEntityFetchStatus,
  setEntityFetchStatus,
} from '../commonReducers/fetchStatusReducers';
import {FAILED, LOADING, LOADED, UPDATING, DELETING} from '../fetchStatus';
import {UPDATE_FROM_SERVER} from '../../actions/types';


const fetchStatusReducerFactory = entityName => (fetchStatuses = {}, action) => {
  const entityNameCaps = _.toSnakeUpper(entityName);
  const {type, payload} = action;

  const createEntitySuccess = `CREATE_${entityNameCaps}_SUCCESS`;
  const updateEntityRequest = `UPDATE_${entityNameCaps}_REQUEST`;
  const updateEntitySuccess = `UPDATE_${entityNameCaps}_SUCCESS`;
  const updateEntityFailure = `UPDATE_${entityNameCaps}_FAILURE`;
  const deleteEntityRequest = `DELETE_${entityNameCaps}_REQUEST`;
  const deleteEntitySuccess = `DELETE_${entityNameCaps}_SUCCESS`;
  const deleteEntityFailure = `DELETE_${entityNameCaps}_FAILURE`;
  const addEntity = `ADD_${entityNameCaps}`;

  switch(type) {
    case createEntitySuccess: {
      const entity = payload[entityName];
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
      const entity = payload[entityName];
      const {id} = entity;
      
      return setEntityFetchStatus(id, LOADED)(fetchStatuses);
    }
    case UPDATE_FROM_SERVER: {
      return hydrateFetchStatuses(action, entityName)(fetchStatuses);
    }
    default:
      return fetchStatuses;
  }
};


export default fetchStatusReducerFactory;