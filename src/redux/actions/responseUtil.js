/**
 * Methods used to parse responses from network calls.
 */

// Sometimes we expect a single entity but from data that's been normalized.
// This lets us retrieve the lone entity.
export const getLoneNormalizedEntity = (entityName, normalizedResponse) => {
  const entities = normalizedResponse.entities[entityName];
  const entityId = Object.keys(entities)[0];

  return entities[entityId];
}