import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import { connect } from 'react-redux'
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import { Button } from 'react-native-elements';
import { createActivityInstance } from 'src/redux/actions/entities/activityInstance';


@connect(
  null,
  (dispatch, props) => ({
    onSubmit: () => {
      const {gqlClient, activityInstance} = props;

      dispatch(createActivityInstance({activityInstance, client: gqlClient}));
    }
  })
)
class ActivitySubmitButton extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    activityInstance: PropTypes.object.isRequired,
  }

  render() {
    const {onSubmit} = this.props;

    return (
      <Button
        raised
        onPress={onSubmit}
        title='Add Activity'
      />
    );
  }
}


export default ActivitySubmitButton;
