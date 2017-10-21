const config = {
  directory: 'server/database/migrations',
  development: {
    client: 'pg',
    connection: 'postgres://localhost/focus-dev',
    // debug: true,
    seeds: {
      directory: 'server/database/seeds',
    }
  },
}


module.exports = config;
