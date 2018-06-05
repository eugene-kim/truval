import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';
import {TouchableOpacity} from 'react-native';

// Redux
import { connect } from 'react-redux';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Component
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const CategoryPill = ({setFieldValue, category, handlePress}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.TouchableOpacity`
    borderRadius: 20
    backgroundColor: ${category.color}
    marginRight: 8
    marginBottom: 10
    paddingVertical: 5
    paddingHorizontal: 9
  `;

  const Content = styled.View`
    flexDirection: row
  `;

  const CategoryIcon = styled(Icon)`
    marginRight: 5
  `;

  const CategoryName = styled.Text`
    ${TextStyles.copy2(Colors.whiteGray)}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container onPress={handlePress}>
      <Content>
        {category.iconName && (
          <CategoryIcon
            name={category.iconName}
            color={Colors.whiteGray}
            size={12}
          />
        )}
        <CategoryName>
          {category.name}
        </CategoryName>
      </Content>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
CategoryPill.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  handlePress: PropTypes.func.isRequired,
  category: PropTypes.category.isRequired,
}


export default connect(
  null,

  // mapDispatchToProps
  (dispatch, props) => {
    const {category, setFieldValue} = props;

    return {
      handlePress: () => {
        console.log('categorypill handlepress');

        // Set the value on the form
        // setFieldValue('category', category);

        // // Close `AddCategoryModal`
        // dispatch();
      }
    }
  }
)(CategoryPill);
