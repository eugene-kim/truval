// --------------------------------------------------
// USER
// --------------------------------------------------

export const getUser = state => state.app.user;
export const getUserProps = state => getUser(state).props;
export const getUserFetchStatus = state => getUser(state).fetchStatus;

const getScreenState = state => state.app.screenState;
export const getAddActivityModalState = state => getScreenState(state).AddActivityModal.isOpen;
export const getLiveActivityInstanceId = state => getScreenState(state).liveActivityInstanceId;