'use strict';

const server = require('./index.js');
const config = require('./configs/config');

server.create(config);
server.start();
