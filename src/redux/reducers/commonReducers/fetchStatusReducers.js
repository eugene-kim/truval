import {LOADED} from '../fetchStatus';


export const hydrateFetchStatuses = (action, entityTypeName) => fetchStatuses => {
  const {payload} = action;

  if (payload.entities && payload.entities[entityTypeName]) {
    return Object.keys(payload.entities[entityTypeName]).reduce((statuses, id) => {
      Object.assign(statuses, {[id]: LOADED});
    }, {});
  }

  return entities;
}

export const deleteEntityFetchStatus = deleteId => fetchStatuses => {
  return Object.keys(fetchStatuses).reduce((updatedStatuses, id) => {
    if (deleteId === id) {
      return updatedStatuses;
    }

    return Object.assign(updatedStatuses, {[id]: fetchStatuses[id]});
  }, {});
}


export const setEntityFetchStatus = (id, status) => fetchStatuses => {
  return _.merge({}, fetchStatuses, {[id]: status});
}