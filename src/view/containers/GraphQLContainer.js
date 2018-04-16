import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import { StyleSheet, Text, TextInput, View } from 'react-native';


export default (getOperationString, options) => ChildComponent => {
  class GraphQLContainer extends Component {
    constructor(props) {
      super(props);

      this.state = {
        queryIsLoading: true,
        queryFailed: false,
      };
    }

    static contextTypes = {
      gqlClient: PropTypes.gqlClient,
    }

    componentDidMount() {
      const {gqlClient} = this.context;

      console.log(`props we received:`);
      console.log(this.props);

      const operationString = getOperationString(this.props);

      gqlClient.query(operationString, options)
      .then(response => this.setState({
        queryIsLoading: false,
        queryFailed: false,
      }))
      .catch(error => {
        this.setState({
          queryIsLoading: false,
          queryFailed: true,
        });

        console.error(error);
        console.log(error.stack);
      });
    }

    render() {
      const {queryIsLoading, queryFailed} = this.state;

      return (
        <ChildComponent
          queryIsLoading={queryIsLoading}
          queryFailed={queryFailed}
          {...this.props}
        />
      );
    }
  }

  return GraphQLContainer;
}