import {
  getUser,
  getUserProps,
  getUserFetchStatus,
} from 'redux/reducers/selectors';

export const userFetchStatusWasSet = async ({action, expectedStatus, store, statusShouldDiffer}) => {
  const previousState = store.getState();

  await store.dispatch(action);

  const newState = store.getState();
  const newFetchStatus = getUserFetchStatus(newState);

  expect(newFetchStatus).toEqual(expectedStatus);

  if (statusShouldDiffer) {
    const previousFetchStatus = getUserFetchStatus(previousState);

    expect(newFetchStatus).not.toEqual(previousFetchStatus);
  }
}

export const validateUserPropertyValue = async ({propertyName, expectedValue, action, store}) => {
  await store.dispatch(action);

  const state = store.getState();
  const userProps = getUserProps(state);

  expect(userProps[propertyName]).toEqual(expectedValue);
}

export const userWasUpdated = async ({propsToUpdate, store, action}) => {
  const preUpdateState = store.getState();
  const preUpdateUserProps = getUserProps(preUpdateState);

  await store.dispatch(action);

  const postUpdateState = store.getState();
  const postUpdateProps = getUserProps(postUpdateState);
  
  Object.keys(propsToUpdate).map(propName => {
    const postUpdateProp = postUpdateProps[propName];
    const propToUpdate = propsToUpdate[propName];

    expect(postUpdateProp).not.toEqual(propToUpdate);
  }); 

  expect(postUpdateProps).toEqual(preUpdateUserProps);
}

export const userWasCreated = async ({store, action}) => {
  await store.dispatch(action);

  const state = store.getState();
  const userProps = getUserProps(state);
  const userPropsKeys = Object.keys(userProps);

  expect(userPropsKeys.length).toBeGreaterThan(0);
}

export const userWasNotCreated = async ({store, action}) => {
  await store.dispatch(action);

  const state = store.getState();
  const userProps = getUserProps(state);
  const userPropsKeys = Object.keys(userProps);

  expect(userPropsKeys.length).toEqual(0);
}

export const userWasNotUpdated = async ({propsToUpdate, store, action}) => {
  const preUpdateState = store.getState();
  const preUpdateUserProps = getUserProps(preUpdateState);

  await store.dispatch(action);

  const state = store.getState();
  const userProps = getUserProps(state);
  const expectedUserProps = _.merge({}, preUpdateUserProps, propsToUpdate);

  expect(userProps).toEqual(expectedUserProps);
  expect(userProps).not.toEqual(preUpdateUserProps);
}