'use strict';

// Libraries
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Routes
const apiRoutes = require('./apiRoutes');


function intializeRoutes(app) {
  const logger = morgan('tiny');

  app.use(logger);

  // Parse incoming requests data (https://github.com/expressjs/body-parser)
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/api', apiRoutes);
  app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
  }));
}


module.exports = {
  intializeRoutes,
}
