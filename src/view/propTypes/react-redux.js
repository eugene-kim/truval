import PropTypes from 'prop-types';

/**
 * Copied from `react-redux`. We use the storeShape propType to set the contextType on our GraphQLContainer
 * since it also needs to access the store from React's context object.
 */

export const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});