const server = require('./server/server');
const config = require('./configs/config');

console.log(`Config port: ${config.port}`);
console.log(`Config hostname: ${config.hostname}`);

server.create(config);
server.start();
