import PropTypes from 'prop-types';

/**
 * Add custom propTypes here. Our components should import this file instead of doing a
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

const createUUIDPropType = isRequired => (props, propName, componentName) => {
  const prop = props[propName];

  if (!prop) {
    if (isRequired) {
      throw new Error(`In ${componentName}, prop ${propName} is required.`);
    }

    return null;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isMatch = prop.match(uuidRegex);

  if (!isMatch) {
    throw new Error(`${propName} must be a UUID. Provided value: ${prop}.`);
  }
}

CustomPropTypes.uuid = createUUIDPropType(false);
CustomPropTypes.uuid.isRequired = createUUIDPropType(true);


export default CustomPropTypes;