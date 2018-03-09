import invariant from 'invariant';



// Entities
export const getSessionEntities = state => getEntities({entityType: 'session', state});
export const getSessionFetchStatus = state => getEntityFetchStatuses({entityType: 'session', state});
export const getNewSessionFetchStatus = state => getNewEntityFetchStatus({entityType: 'session', state});

export const getCategoryEntities = state => getEntities({entityType: 'category', state});
export const getCategoryFetchStatus = state => getEntityFetchStatuses({entityType: 'category', state});
export const getNewCategoryFetchStatus = state => getNewEntityFetchStatus({entityType: 'category', state});

export const getActivityTypeEntities = state => getEntities({entityType: 'activityType', state});
export const getActivityTypeFetchStatus = state => getEntityFetchStatuses({entityType: 'activityType', state});
export const getNewActivityTypeFetchStatus = state => getNewEntityFetchStatus({entityType: 'activityType', state});

export const getActivityInstanceEntities = state => getEntities({entityType: 'activityInstance', state});
export const getActivityInstanceFetchStatus = state => getEntityFetchStatuses({entityType: 'activityInstance', state});
export const getNewActivityInstanceFetchStatus = state => getNewEntityFetchStatus({entityType: 'activityInstance', state});

export const getEntities = ({entityType, state}) => state.entities[entityType].entities;

export const getEntityFetchStatuses = ({entityType, state}) => state.entities[entityType].fetchStatus;
export const getEntityFetchStatus = ({id, entityType, state}) => getEntityFetchStatuses({entityType, state})[id];
export const getNewEntityFetchStatus = ({entityType, state}) => state.entities[entityType].new.fetchStatus;

export const getEntityByName = ({name, entityType, state}) => {
  invariant(
    name && entityType && state,
    `Parameters 'name', 'entityType', and 'state' must be provided!`
  );

  const entities = getEntities({entityType, state});
  const entityId = Object.keys(entities).find(id => entities[id].name === name);

  return entities[entityId];
}

export const getEntityById = ({id, entityType, state}) => getEntities({entityType, state})[id];

// App
export const getUserProps = state => state.app.user.props;
export const getUserFetchStatus = state => state.app.user.fetchStatus;