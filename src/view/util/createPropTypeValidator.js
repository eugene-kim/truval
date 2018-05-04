/**
 * Generates a propType validator.
 *
 * @param {string} isRequired - Whether the prop must be present or not.
 * @param {string} validateProp - Function of signature ({prop, propName}) that returns and object
 * of the shape: { isValid, errorMessage }
 */
const createPropTypeValidator = ({isRequired, propValidator}) => (props, propName, componentName) => {
  const prop = props[propName];

  if (!prop && isRequired) {
    throw new Error(`'${propName}' is a required prop in ${componentName}.`);
  }

  const {isValid, errorMessage} = propValidator(prop);

  if (!isValid) {
    throw new Error(errorMessage);
  }
};


export default createPropTypeValidator;