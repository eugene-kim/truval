import PropTypes from 'prop-types';
import createPropTypeValidator from './createPropTypeValidator';
import moment from 'moment';

/**
 * Add custom propTypes here. Our components should import this file instead of doing a
 * `import PropTypes from prop-types` so that we have a single import statement.
 */

// --------------------------------------------------
// datetime
// --------------------------------------------------

const datetimeValidator = ({prop, propName}) => {
  const mo = moment(prop);

  return mo.isValid() ? {
    isValid: true,
  } : {
    isValid: false,
    errorMessage: `${propName} must be a datestring consumable by the moment.js library. Provided value: ${prop}.`,
  }
};

PropTypes.datetime = createPropTypeValidator({
  isRequired: false,
  propValidator: datetimeValidator,
});
PropTypes.datetime.isRequired = createPropTypeValidator({
  isRequired: true,
  propValidator: datetimeValidator,
});

// --------------------------------------------------
// uuid
// --------------------------------------------------

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uuidPropValidator = ({prop, propName}) => {
  const isMatch = prop.match(uuidRegex);

  return isMatch ? {
    isValid: true,
  } : {
    isValid: false,
    errorMessage: `${propName} must be a UUID. Provided value: ${prop}.`,
  };
}

PropTypes.uuid = createPropTypeValidator({
  isRequired: false,
  propValidator: uuidPropValidator,
});
PropTypes.uuid.isRequired = createPropTypeValidator({
  isRequired: true,
  propValidator: uuidPropValidator,
});

// --------------------------------------------------
// Entities
// --------------------------------------------------

PropTypes.activityInstance = PropTypes.shape({
  id: PropTypes.uuid.isRequired,
  start: PropTypes.datetime.isRequired,
  isComplete: PropTypes.bool.isRequired,
  activityTypeId: PropTypes.uuid.isRequired,
  sessionId: PropTypes.uuid.isRequired,

  // Optional
  end: PropTypes.datetime,
  duration: PropTypes.number,
  categoryId: PropTypes.uuid,
  
});

PropTypes.activityType = PropTypes.shape({
  id: PropTypes.uuid.isRequired,
  name: PropTypes.string.isRequired,
  activityCount: PropTypes.number.isRequired,

  // Optional
  categoryId: PropTypes.uuid,
})

PropTypes.category = PropTypes.shape({
  id: PropTypes.uuid.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool.isRequired,
});

PropTypes.session = PropTypes.shape({
  id: PropTypes.uuid.isRequired,
  name: PropTypes.string.isRequired,
  start: PropTypes.datetime.isRequired,
  isComplete: PropTypes.bool.isRequired,
  activityInstances: PropTypes.arrayOf(PropTypes.uuid).isRequired,

  // Optional
  end: PropTypes.datetime,
});

// --------------------------------------------------
// Misc
// --------------------------------------------------

PropTypes.gqlClient = PropTypes.shape({
  query: PropTypes.func.isRequired,
});

PropTypes.navigation = PropTypes.shape({
  navigate: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  addListener: PropTypes.func.isRequired,
  isFocused: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  setParams: PropTypes.func.isRequired,
  getParam: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
});

PropTypes.reduxStore = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});


export default PropTypes;

/*
PropTypes examples:

import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};

*/