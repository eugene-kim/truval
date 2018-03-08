import _ from 'lodash';
import invariant from 'invariant';



export const addEntity = (action, entityTypeName) => entities =>
  createEntity(action, entityTypeName)(entities);

/**
 * We use currying so that we can compose this function with other reducers that simply take in
 * `entities` as the param.
 */
export const createEntity = (action, entityTypeName) => entities => {
  const {payload} = action;
  const entity = payload[entityTypeName];

  invariant (
    entity,
    `${entityTypeName} is a required property in ${action.type}'s payload.`,
  );

  const {id} = entity;

  return _.merge({}, entities, {[id]: entity});
};

export const updateEntity = action => entities => {
  const {payload} = action;
  const {id, propsToUpdate} = payload;

  invariant(
    id && propsToUpdate,
    `id and propsToUpdate are required properties in the action ${action.type}'s' payload.`,
  );

  const entity = entities[id];
  const updatedEntity = _.merge({}, entity, propsToUpdate);

  return _.merge({}, entities, {[id]: updatedEntity});
}

export const deleteEntity = action => entities => {
  const {payload} = action;
  const deletedEntityId = payload.id;

  invariant(id, `id is a required property in the action ${action.type}'s' payload.`);

  return Object.keys(entities).reduce((updatedEntities, id) => {
    if (deletedEntityId === id) {
      return updatedEntities;
    }

    return Object.assign(updateEntities, {[id]: entities[id]});
  }, {});
}

export const hydrateEntities = (action, entityTypeName) => entities => {
  const {payload} = action;

  if (payload.entities && payload.entities[entityTypeName]) {
    return _.merge({}, entities, payload.entities[entityTypeName]);
  }

  return entities;
}