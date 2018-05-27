import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';
import {TouchableHighlight} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const CategoryInput = ({handlePress, setFieldValue, fieldName, fieldValue}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.TouchableHighlight`
    paddingVertical: 12
    paddingLeft: 10
    paddingRight: 5
    borderLeftWidth: 2
    borderLeftColor: ${Colors.lightGray}
    backgroundColor: ${Colors.lightGray}
  `;

  const Content = styled.View`
    flexDirection: row
    justifyContent: center
    alignItems: center
  `;

  const Label = styled.Text`
    ${TextStyles.copy4Italic(Colors.whiteGray)}
  `;

  const CategoryName = styled.Text`
    ${TextStyles.copy3(fieldValue ? fieldValue.color : '')}
  `;

  const Chevron = styled(Icon)`
    marginBottom: -3
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Container>
      <Content>
        {
          fieldValue ?
          <CategoryName>{fieldValue.name.toUpperCase()}</CategoryName> :
          <Label>{'Category'}</Label>
        }
        <Chevron
          name={'chevron-down'}
          size={21}
          color={Colors.whiteGray}
        />
      </Content>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
CategoryInput.propTypes = {
  handlePress: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,

  // Will be undefined if user hasn't selected a category.
  fieldValue: PropTypes.object,
}


export default CategoryInput;
