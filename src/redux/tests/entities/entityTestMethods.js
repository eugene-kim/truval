import _ from 'src/libs/dash';

import {
  getEntities,
  getEntityByName,
  getEntityById,
  getEntityFetchStatuses,
  getEntityFetchStatus,
  getNewEntityFetchStatus,
} from 'src/redux/reducers/selectors/entitySelectors';


// --------------------------------------------------
// FETCH STATUS
// --------------------------------------------------

export const entityFetchStatusWasDeleted = async ({id, entityType, store, action}) => {
  const previousState = store.getState();
  const previousEntityFetchStatus = getEntityFetchStatus({id, entityType, state: previousState});

  await store.dispatch(action);

  const newState = store.getState();
  const newEntityFetchStatus = getEntityFetchStatus({id, entityType, state: newState});

  expect(newEntityFetchStatus).toBeUndefined();
  expect(previousEntityFetchStatus).toBeDefined();
}

export const entityFetchStatusWasSet = async ({id, store, entityType, action, expectedStatus, statusShouldDiffer}) => {
  const previousState = store.getState();

  await store.dispatch(action);

  const newState = store.getState();
  const newFetchStatuses = getEntityFetchStatuses({entityType, state: newState});
  const newFetchStatus = newFetchStatuses[id];

  expect(newFetchStatus).toEqual(expectedStatus);

  if (statusShouldDiffer) {
    const previousFetchStatuses = getEntityFetchStatuses({entityType, state: previousState});
    const previousFetchStatus = previousFetchStatuses[id];

    expect(newFetchStatus).not.toEqual(previousFetchStatus);
  }
}

export const newEntityFetchStatusWasSet = async ({entityType, expectedStatus, store, action}) => {
  await store.dispatch(action);

  const state = store.getState();
  const newEntityFetchStatus = getNewEntityFetchStatus({entityType, state});

  expect(newEntityFetchStatus).toEqual(expectedStatus);
}

export const entityFetchStatusWasCreated = async ({entityType, store, mockStore, action, createEntityActionType, expectedStatus}) => {
  const previousState = store.getState();
  const previousFetchStatuses = getEntityFetchStatuses({entityType, state: previousState});

  await dispatch({ store, mockStore, action });

  const id = getNewEntityId({
    mockStore,
    actionType: createEntityActionType,
    entityType,
  });

  const newState = store.getState();
  const newFetchStatuses = getEntityFetchStatuses({entityType, state: newState});
  const newFetchStatus = newFetchStatuses[id];

  expect(previousFetchStatuses[id]).toBeUndefined();
  expect(newFetchStatus).toEqual(expectedStatus);
}

// --------------------------------------------------
// ENTITIES
// --------------------------------------------------

export const validateEntityPropertyValue = async ({id, entityType, propertyName, expectedValue, action, store}) => {
  await store.dispatch(action);

  const state = store.getState();
  const entity = getEntityById({id, entityType, state});

  expect(entity[propertyName]).toEqual(expectedValue);
}

export const entityWasDeleted = async ({id, store, entityType, action}) => {
  const previousState = store.getState();
  const previousEntities = getEntities({entityType, state: previousState});

  await store.dispatch(action);

  const newState = store.getState();
  const newEntities = getEntities({entityType, state: newState});

  expect(previousEntities[id]).toBeDefined();
  expect(newEntities[id]).toBeUndefined();
}

export const entityWasNotDeleted = async ({id, store, entityType, action}) => {
  await store.dispatch(action);

  const state = store.getState();
  const entities = getEntities({entityType, state});

  expect(entities[id]).toBeDefined();
}

export const getNewEntityId = ({mockStore, actionType, entityType}) => {
  const actions = mockStore.getActions();
  const action = actions.find(action => action.type === actionType);
  const {payload} = action;
  const entity = payload[entityType];

  return entity.id;
}

export const entityWasUpdated = async ({id, entityType, propsToUpdate, store, action}) => {
  const preUpdateState = store.getState();
  const preUpdateEntity = getEntityById({id, entityType, state: preUpdateState});

  await store.dispatch(action);

  const state = store.getState();
  const entity = getEntityById({state, entityType, id});
  const expectedEntity = _.merge({}, preUpdateEntity, propsToUpdate);

  expect(entity).toEqual(expectedEntity);
  expect(entity).not.toEqual(preUpdateEntity);
}

export const entityWasNotUpdated = async ({id, entityType, propsToUpdate, store, action}) => {
  const preUpdateState = store.getState();
  const preUpdateEntity = getEntityById({id, entityType, state: preUpdateState});

  await store.dispatch(action);

  const state = store.getState();
  const entity = getEntityById({state, entityType, id});

  // Validate that updated entity contains all properties in propsToUpdate.
  Object.keys(propsToUpdate).map(propName => {
    const propValue = propsToUpdate[propName];
    const entityValue = entity[propName];

    expect(entityValue).not.toEqual(propValue);
  });

  expect(entity).toEqual(preUpdateEntity);
}

export const entityWasCreated = async ({entityType, store, mockStore, action, createEntityActionType}) => {
  const previousState = store.getState();
  const previousEntities = getEntities({entityType, state: previousState});

  await dispatch({ store, mockStore, action });

  const id = getNewEntityId({
    mockStore,
    actionType: createEntityActionType,
    entityType,
  });

  const newState = store.getState();
  const newEntities = getEntities({entityType, state: newState});

  expect(previousEntities[id]).toBeUndefined();
  expect(newEntities[id]).toBeDefined();
}

export const entityWasNotCreated = async ({entityType, store, action}) => {
  const previousState = store.getState();
  const preDispatchEntities = getEntities({entityType, state: previousState});
  const preDispatchEntityCount = Object.keys(preDispatchEntities).length;

  await store.dispatch(action);

  const postDispatchState = store.getState();
  const postDispatchEntities = getEntities({entityType, state: postDispatchState});
  const postDispatchEntitiesCount = Object.keys(postDispatchEntities).length;

  expect(postDispatchEntitiesCount).toEqual(preDispatchEntityCount);
}


// --------------------------------------------------
// STORE
// --------------------------------------------------

export const dispatch = ({store, mockStore, action}) => Promise.all([
  store.dispatch(action),
  mockStore.dispatch(action),
]);