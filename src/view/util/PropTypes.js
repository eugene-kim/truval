import PropTypes from 'prop-types';

/**
 * Add custom propTypes here. Our components should refer to this file instead of doing a
 * `import PropTypes from prop-types` so that we have a single import statement.
 */

const CustomPropTypes = PropTypes;

CustomPropTypes.gqlClient = PropTypes.shape({
  query: PropTypes.func.isRequired,
});

CustomPropTypes.reduxStore = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});


export default CustomPropTypes;