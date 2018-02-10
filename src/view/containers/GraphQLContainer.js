import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {storeShape} from 'view/propTypes/react-redux';

export default (getOperationString, options) => (ChildComponent) => {
  class GraphQLContainer extends Component {
    static contextTypes = {
      client: PropTypes.object.isRequired,
      store: PropTypes.storeShape.isRequired,
    }

    componentWillMount() {
      const {client, store} = this.context;
      const state = store.getState();
      const operationString = getOperationString(state);

      client.query(operationString, store, options);
    }

    render() {
      return (
        <ChildComponent {...this.props} />
      );
    }
  }

  return GraphQLContainer;
}