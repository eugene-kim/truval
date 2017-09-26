// Libraries
const _ = require('lodash');


const env = process.env.NODE_ENV || 'local';
const envConfig = require(`./${env}.js`);
const defaultConfig = {
  env,
};
const config = _.merge(defaultConfig, envConfig);


module.exports = config;
