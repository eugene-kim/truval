const config = {
  directory: 'server/database/migrations',
  development: {
    client: 'postgresql',
    connection: {
      database: 'focus-dev'
    }
  }
}


module.exports = config;
