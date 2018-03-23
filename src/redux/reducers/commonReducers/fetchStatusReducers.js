import _ from 'src/libs/dash';
import {LOADED} from '../fetchStatus';


export const hydrateFetchStatuses = ({action, entityType, fetchStatuses}) => {
  const {payload} = action;

  if (payload.entities && payload.entities[entityType]) {
    return Object.keys(payload.entities[entityType]).reduce((statuses, id) => {
      return Object.assign(fetchStatuses, {[id]: LOADED});
    }, {});
  }

  return fetchStatuses;
}

export const deleteEntityFetchStatus = deleteId => fetchStatuses => {
  return Object.keys(fetchStatuses).reduce((updatedStatuses, id) => {
    if (deleteId === id) {
      return updatedStatuses;
    }

    return Object.assign(updatedStatuses, {[id]: fetchStatuses[id]});
  }, {});
}


export const setEntityFetchStatus = (id, status) => fetchStatuses =>
  _.merge({}, fetchStatuses, {[id]: status})