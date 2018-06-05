import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';
import { ScrollView } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { getEntitiesList } from 'src/redux/selectors/entitySelectors';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

// Components
import CategoryPill from './components/CategoryPill';


const SelectCategoryModal = ({setFieldValue, categories}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View`
    alignItems: center
    paddingHorizontal: 16
    paddingVertical: 22
  `;

  const Header = styled.Text`
    ${TextStyles.display1()}
    marginBottom: 10
  `;

  const Content = styled(ScrollView).attrs({
    contentContainerStyle: props => ({
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    }),
  })`
    maxHeight: 200
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Container>
      <Header>
        {'Select a category'}
      </Header>
      <Content>
        {categories.map(category => (
          <CategoryPill
            key={category.id}
            setFieldValue={setFieldValue}
            category={category}
          />
        ))}
      </Content>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
SelectCategoryModal.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.category).isRequired,
}


export default connect(

  // mapStateToProps
  (state, props) => ({
    categories: getEntitiesList({entityType: 'category', state}),
  }),

)(SelectCategoryModal);