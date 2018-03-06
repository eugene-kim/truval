import _ from 'lodash';


_.toSnakeUpper = string => _.flow(_.snakeCase, _.toUpper)(string);


export default _;
