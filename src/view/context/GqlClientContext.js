// React
import React from 'react';
import GraphQLContainer from 'src/view/containers/GraphQLContainer';

import TruvalStack from 'src/view/app/TruvalNavStack';

// GraphQL
import getGqlClient from 'src/graphql/client';



export const GqlClientContext = React.createContext();
export const GqlClientContextConsumer = (getOperationString, options) => ChildComponent => props => {

  const query = getOperationString(props);

  return (
    <GqlClientContext.Consumer>
      {
        gqlClient => (
          <GraphQLContainer
            gqlClient={gqlClient}
            query={query}
            queryOptions={options}>
            <ChildComponent {...props} />
          </GraphQLContainer>
        )
      }
    </GqlClientContext.Consumer>
  );
}