// --------------------------------------------------
// STORE
// --------------------------------------------------

export const actionsWereDispatched = async ({mockStore, expectedActionTypes, action}) => {
  await mockStore.dispatch(action);

  const actions = mockStore.getActions();
  const actionTypes = actions.map(action => action.type);

  expect(actionTypes).toEqual(expectedActionTypes);
}