import express from 'express';
import morgan from 'morgan';
import gqlClient from '../graphql/client';

// This package automatically parses JSON requests.
import bodyParser from 'body-parser';

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
import configurePostgresDriver from './database/configurePostgresDriver';

configurePostgresDriver();

import db from './database';
import schema from 'graphql/schema';

import {createStore} from 'redux';
import reducer from 'redux/reducers/root';
import initialState from 'redux/store/initialState';

var app = express();


// Basic logging
app.use(morgan('tiny'));

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// Blank store for testing
const store = createStore(reducer, initialState);

app.get('/testMutation', async (req, res) => {
  const mutation = `mutation {
    createActivityInstance(
      name: "Write seed data"
      start: "2017-10-21T00:00:00.000Z"
      sessionId: "997a5210-33d1-4198-a4a4-5f1ea477cc01"
      categoryId:"ca05ca36-805c-4f67-a097-a45988ba82d7"
      userId:"cb39dbb5-caa8-4323-93a5-13450b875887"
    ) {
      id, isComplete, start, end
      activityType {
        id, name, activityCount, categoryId,
      } 
    }
  }`;

  try {
    const normalizedData = await gqlClient({store}).mutate(mutation, {shouldNormalizeData: true});

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(normalizedData));
  } catch(error) {
    console.log(error);
  }
});
app.get('/testQuery', async (req, res) => {
  const queryString = `query {
    user(id:"cb39dbb5-caa8-4323-93a5-13450b875887") {
      id,
      username,
      categories {
        id,
        name,
        color,
      },
      sessions {
        id,
        name,
        start,
        end,
        activityInstances {
          id,
          start,
          end,
          isComplete,
          activityType {
            id,
            category {
              id,
              name,
              color
            }
          }
        }
      },
      activityTypes {
        id,
        name,
        activityCount,
      }
    }
  }`;

  try {
    const normalizedData = await gqlClient({store: createStore(reducer, initialState)}).query(queryString);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(normalizedData));
  } catch(error) {
    console.log(error);
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Focus app running on: ${PORT}.`)
});
