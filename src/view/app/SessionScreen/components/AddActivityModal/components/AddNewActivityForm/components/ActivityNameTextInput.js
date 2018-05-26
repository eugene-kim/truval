import React, {Component} from 'react';
import styled from "styled-components";
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';
import _ from 'src/libs/dash';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';


/**
 * Using a class component instead of a function to prevent re-rendering whenever
 * a new `fieldValue` prop is passed in because the value will change every single
 * time the user types into the TextInput. If the TextInput re-renders, then the 
 * focus is taken out of the TextInput, which makes for a horrible UX.
 */
class ActivityNameTextInput extends Component {

  // --------------------------------------------------
  // Props
  // --------------------------------------------------
  static propTypes = {
    setFieldValue: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    maxLength: 30,
  };

  // --------------------------------------------------
  // Lifecycle Methods
  // --------------------------------------------------  

  shouldComponentUpdate(nextProps) {

    // I'd use ES6's destructing assignment + spread properties,
    // but I can't do that here since I'd be declaring two of
    // the same variable, `fieldValue`.
    const restNextProps = _.omit(nextProps, 'fieldValue');
    const restCurrentProps = _.omit(this.props, 'fieldValue');

    return !_.shallowEqual(restNextProps, restCurrentProps);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    const {
      setFieldValue,
      fieldName,
      fieldValue,
      errorMessage,
      maxLength,
    } = this.props;

    const Container = styled.View`
      position: relative
      marginBottom: 20
    `;

    const ActivityNameInput = styled.TextInput`
      height: 44
      borderRadius: 3
      borderWidth: 1
      borderColor: ${Colors.lightGray}
      paddingLeft: 10
      ${TextStyles.copy4()}
    `;

    const ErrorMessage = styled.Text`
      ${TextStyles.copy1(Colors.lightRed)}
      position: absolute
      bottom: -18
    `;

    return (
      <Container>
        <ActivityNameInput
          name={fieldName}
          placeholder={'Name'}
          onChangeText={ text => setFieldValue(fieldName, text)}
          value={fieldValue}
          maxLength={maxLength}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Container>
    );
  }
};


export default ActivityNameTextInput;
