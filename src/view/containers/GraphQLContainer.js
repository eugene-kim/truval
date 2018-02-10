import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import CustomPropTypes from 'view/propTypes/CustomPropTypes';


export default (getOperationString, options) => ChildComponent => {
  class GraphQLContainer extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        didError: false,
      }
    }

    static contextTypes = {
      gqlClient: PropTypes.object.isRequired,
      store: CustomPropTypes.storeShape.isRequired,
    }

    componentWillMount() {
      const {gqlClient, store} = this.context;
      const state = store.getState();
      const operationString = getOperationString(state);

      gqlClient.query(operationString, store, options)
      .then(response => this.setState({isLoading: false}))
      .catch(error => {
        this.setState({
          isLoading: false,
          didError: true,
        });

        console.error(error);
      });
    }

    render() {
      const {isLoading, didError} = this.state;

      return (
        <ChildComponent
          isLoading={isLoading}
          didError={didError}
          {...this.props}
        />
      );
    }
  }

  return GraphQLContainer;
}