'use strict';

// Libraries
const express = require('express');

// Project
const userRoutes = require('./userRoutes');


const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.status(200).send('This is the API route');
});
// apiRouter.use('/user', userRoutes);


module.exports = apiRouter;
