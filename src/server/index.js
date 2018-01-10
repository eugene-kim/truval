const express = require('express');
const morgan = require('morgan');
const gqlClient = require('./graphql/client');

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

app.get('/testMutation', async (req, res) => {
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

  try {
    const normalizedData = await gqlClient.mutate(mutationString);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    res.send(JSON.stringify(normalizedData));
  } catch(error) {
    console.log(error);
  }
});
app.get('/testQuery', async (req, res) => {
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

  try {
    const normalizedData = await gqlClient.query(queryString);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    res.send(JSON.stringify(normalizedData));
  } catch(error) {
    console.log(error);
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Focus app running on: ${PORT}.`)
});
