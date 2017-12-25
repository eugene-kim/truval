const express = require('express');
const morgan = require('morgan');

// This package automatically parses JSON requests.
const bodyParser = require('body-parser');

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const configurePostgresDriver = require('./database/configurePostgresDriver');
configurePostgresDriver();
const db = require('./database');
const schema = require('./graphql/schema');

var app = express();

app.use(morgan('tiny'));

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));


app.get('/test', (req, res) => {
  require('./graphql/client/gqlParser')()
  .then(normalizedData => {
    console.log(normalizedData);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(normalizedData)); 
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  });
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Focus app running on: ${PORT}.`)
});
