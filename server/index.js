'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const app = express();
const server = {
  create: (config) => {
    app.set('env', config.env);
    app.set('port', config.port);
    app.set('hostname', config.hostname);

    routes.intializeRoutes(app);
  },

  start: () => {
    const hostname = app.get('hostname');
    const port = app.get('port');

    app.listen(port, () => {
      console.log(`Express server listening on - http://${hostname}:${port}`);
    });
  },
}


module.exports = server;
