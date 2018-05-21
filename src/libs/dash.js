import _ from 'lodash';
import shallowEqual from './util/shallowEqual';


_.toSnakeUpper = string => _.flow(_.snakeCase, _.toUpper)(string);
_.shallowEqual = shallowEqual;

export default _;
