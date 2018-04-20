import React from 'react';
import { GqlClientContext } from 'src/view/context/GqlClientContext';
import GraphQLContainer from './GraphQLContainer';


export default (getOperationString, options) => ChildComponent => props => {

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