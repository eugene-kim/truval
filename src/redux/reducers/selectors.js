import invariant from 'invariant';



// Entities
export const getSessionEntities = state => getEntities({entityName: 'session', state});
export const getSessionFetchStatus = state => getEntityFetchStatuses({entityName: 'session', state});
export const getNewSessionFetchStatus = state => getNewEntityFetchStatus({entityName: 'session', state});

export const getCategoryEntities = state => getEntities({entityName: 'category', state});
export const getCategoryFetchStatus = state => getEntityFetchStatuses({entityName: 'category', state});
export const getNewCategoryFetchStatus = state => getNewEntityFetchStatus({entityName: 'category', state});

export const getActivityTypeEntities = state => getEntities({entityName: 'activityType', state});
export const getActivityTypeFetchStatus = state => getEntityFetchStatuses({entityName: 'activityType', state});
export const getNewActivityTypeFetchStatus = state => getNewEntityFetchStatus({entityName: 'activityType', state});

export const getActivityInstanceEntities = state => getEntities({entityName: 'activityInstance', state});
export const getActivityInstanceFetchStatus = state => getEntityFetchStatuses({entityName: 'activityInstance', state});
export const getNewActivityInstanceFetchStatus = state => getNewEntityFetchStatus({entityName: 'activityInstance', state});

const getEntities = ({entityName, state}) => state.entities[entityName].entities;
const getEntityFetchStatuses = ({entityName, state}) => state.entities[entityName].fetchStatus;
const getNewEntityFetchStatus = ({entityName, state}) => state.entities[entityName].new.fetchStatus;

export const getEntityByName = ({name, entityTypeName, state}) => {
  invariant(
    name && entityTypeName && state,
    `Parameters 'name', 'entityTypeName', and 'state' must be provided!`
  );

  const entities = getEntities({entityName: entityTypeName, state});
  const entityId = Object.keys(entities).find(id => entities[id].name === name);

  return entities[entityId];
}

// App
export const getUserProps = state => state.app.user.props;
export const getUserFetchStatus = state => state.app.user.fetchStatus;