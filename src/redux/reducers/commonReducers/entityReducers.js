import _ from 'lodash';
import invariant from 'invariant';



export const addEntity = (action, entityType) => entities =>
  createEntity(action, entityType)(entities);

/**
 * We use currying so that we can compose this function with other reducers that simply take in
 * `entities` as the param.
 */
export const createEntity = (action, entityType) => entities => {
  const {payload} = action;
  const entity = payload[entityType];

  invariant (
    entity,
    `${entityType} is a required property in ${action.type}'s payload.`,
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

    return Object.assign(updatedEntities, {[id]: entities[id]});
  }, {});
}

export const getPayloadEntities = (payload, entityType) => payload.entities[entityType];
export const hydrateEntities = ({action, entityType, entities}) => {
  const {payload} = action;
  const payloadEntities = getPayloadEntities(payload, entityType);

  if (payloadEntities) {
    return _.merge({}, entities, payloadEntities);
  }

  return entities;
}