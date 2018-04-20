import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {View, Text} from 'styled-x';

class GraphQLContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryIsLoading: true,
      queryFailed: false,
    };
  }

  static propTypes = {
    gqlClient: PropTypes.gqlClient.isRequired,
    query: PropTypes.string.isRequired,

    // Must be a single element.
    children: PropTypes.element.isRequired,
    queryOptions: PropTypes.object,
  }

  componentDidMount() {
    const {gqlClient, query, queryOptions} = this.props;

    gqlClient.query(query, queryOptions)
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
    const newProps = {...this.props, queryIsLoading, queryFailed};

    return React.cloneElement(this.props.children, {...newProps});
  }
}


export default GraphQLContainer