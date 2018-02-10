import config from './knexfile';
import knex from 'knex';

// TODO: Parameterize this
const env = 'development';
const knexInstance = knex(config[env]);

knexInstance.migrate.latest(config);

export default knexInstance;
