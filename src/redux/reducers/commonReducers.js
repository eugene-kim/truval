import _ from 'lodash';


export function addEntity(entities, action, entityTypeName) {
  const {payload} = action;
  const entity = payload[entityTypeName];
  const {id} = entity;

  return _.merge({}, entities, {[id]: entity});
};

export function editEntity(entities, action) {
  const {payload} = action;
  const {id, propsToEdit} = payload;
  const entity = entities[id];
  const updatedEntity = _.merge({}, entity, propsToEdit);

  return _.merge({}, entities, {[id]: updatedEntity});
}

export function deleteEntity(entities, action) {
  const {payload} = action;
  const {id} = payload;
  const remainingEntities = {};

  Object.keys(entities).map(entityId => {
    if (id !== parseInt(entityId)) {
      const entity = entities[entityId];

      remainingEntities[entityId] = entity;
    }
  });

  return remainingEntities;
}

export function hydrateEntities(entities, action, entityTypeName) {
  const {payload} = action;

  if (payload.entities && payload.entities[entityTypeName]) {
    return _.merge({}, entities, payload.entities[entityTypeName]);
  }

  return entities;
}