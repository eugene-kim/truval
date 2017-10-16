const config = require('./knexfile.js');

// TODO: Parameterize this
const env = 'development';
const knex = require('knex')(config[env])

knex.migrate.latest(config);

module.exports = knex;
