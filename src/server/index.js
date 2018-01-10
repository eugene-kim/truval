const express = require('express');
const morgan = require('morgan');
const gqlClient = require('graphql/client');

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

app.get('/testMutation', (req, res) => {
  const mutationString = `mutation {
    updateUser(id:1, username:"the hugest") {
      id,
      username,
      sessions {
        id,
        name,
        start,
        activities {
          id,
          name
        }
      }
    }
  }`;

  gqlClient.mutate(mutationString);
});
app.get('/test', (req, res) => {
  const queryString = `query {
    user(id:1) {
      id,
      username,
      email,
      password,
      sessions {
        id,
        name,
        start,
        isComplete,
        activities {
          id,
          start,
          end,
          isComplete,
          session {
            id,
            start,
            end,
            isComplete,
            activities {
              id,
              start,
              end,
            }
          },
          category {
            id,
            color,
            name
          }
        }
      }
    }
  }`;

  require('./graphql/client/parser')(queryString)
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
