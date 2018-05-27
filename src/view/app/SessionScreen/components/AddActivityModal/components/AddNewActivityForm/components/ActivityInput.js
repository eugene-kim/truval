import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';
import _ from 'src/libs/dash';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Components
import ActivityNameTextInput from './ActivityNameTextInput';
import CategoryInput from './CategoryInput';


class ActivityInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    maxNameLength: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    maxNameLength: 30,
  };

  // --------------------------------------------------
  // Lifecycle Methods
  // --------------------------------------------------

  /**
   * Only update when category value has changed.
   */
  shouldComponentUpdate(nextProps) {
    const currentValues = this.props.values;
    const nextValues = nextProps.values;

    const currentCategoryValue = currentValues.category;
    const nextCategoryValue = nextValues.category;

    return !_.shallowEqual(currentCategoryValue, nextCategoryValue);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {setFieldValue, values, maxNameLength} = this.props;

    const Container = styled.View`
      flexDirection: row
      borderRadius: 3
      borderWidth: 1
      borderColor: ${Colors.lightGray}
    `;

    const activityNameFieldName = 'activityName';
    const categoryFieldName = 'category';

    return (
      <Container style={this.props.style}>
        <ActivityNameTextInput
          setFieldValue={setFieldValue}
          fieldName={activityNameFieldName}
          fieldValue={values[activityNameFieldName]}
          maxLength={maxNameLength}
        />
        <CategoryInput
          handlePress={() => {}}
          setFieldValue={setFieldValue}
          fieldName={categoryFieldName}
          fieldValue={values[categoryFieldName]}
        />
      </Container>
    );
  }
}


export default ActivityInput;
