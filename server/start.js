'use strict';

const server = require('./index.js');
const serverConfig = require('./config/server');

server.create(serverConfig);
server.start();
