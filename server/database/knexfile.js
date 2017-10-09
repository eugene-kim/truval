const config = {
  directory: 'server/database/migrations',
  development: {
    client: 'pg',
    connection: 'postgres://localhost/focus-dev',
  }
}


module.exports = config;
