// Libraries
const _ = require('lodash');

const env = process.env.NODE_ENV || 'local';

console.log(`Environment:  ${env}`);

// TODO: Figure out how to do this with the import statement.
const envConfig = require(`./${env}.js`);
const defaultConfig = {
  env,
};


module.exports = _.merge(defaultConfig, envConfig);
