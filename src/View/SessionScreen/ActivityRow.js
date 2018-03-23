import React, {Component} from 'react';
import PropTypes from 'src/view/util/PropTypes';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import { connect } from 'react-redux'

import {getEntityById} from 'src/redux/reducers/selectors/entitySelectors';


@connect(
  (state, props) => {
    const {activityInstance} = props;
    const {activityTypeId} = activityInstance;
    const activityType = getEntityById({id: activityTypeId, entityType: 'activityType', state});
    const {categoryId} = activityType;
    const category = getEntityById({id: categoryId, entityType: 'category', state});

    return {
      category,
      activityType,
    }
  }
)
class ActivityRow extends Component {
  static propTypes = {
    category: PropTypes.object.isRequired,
    activityType: PropTypes.object.isRequired,
    activityInstance: PropTypes.object.isRequired,
  }

  render() {
    const {category, activityType, activityInstance} = this.props;
    const {start} = activityInstance;
    const {name} = activityType;
    const categoryName = category.name;

    return (
      <View style={styles.container}>
        <Text style={styles.name}>
          {name}
        </Text>
        <Text style={styles.category}>
          {categoryName}
        </Text>
        <Text style={styles.start}>
          {start}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});


export default ActivityRow;