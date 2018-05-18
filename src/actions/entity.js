export const setEntities = normalized => ({
  type: 'SET_ENTITIES',
  normalized
});

export const removeEntities = (resource, ids) => ({
  type: 'REMOVE_ENTITIES_FROM_PAGE',
  resource,
  ids
});
