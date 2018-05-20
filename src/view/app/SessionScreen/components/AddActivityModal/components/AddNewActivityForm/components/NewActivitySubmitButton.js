import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';

// 
import {TouchableHighlight} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';
import Shadows from 'src/view/styles/shadows';


const NewActivitySubmitButton = ({ handlePress }) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled(TouchableHighlight)`
    ${Shadows.buttonShadow_1}
  `;

  // Note: Adding a background color is a workaround to prevent the child element
  // from inheriting the shadow of its container.
  // Issue: https://github.com/facebook/react-native/issues/10049
  const Content = styled.View`
    alignItems: center
    paddingVertical: 11
    width: 100%
    borderRadius: 6
    ${Shadows.buttonShadow_2}
    backgroundColor: ${Colors.primary}
  `;

  const ButtonText = styled.Text`
    flexBasis: auto
    ${TextStyles.mediumBold(Colors.text.whiteGray)}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container onPress={handlePress}>
      <Content>
        <ButtonText>
          {'ADD NEW'}
        </ButtonText>
      </Content>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
NewActivitySubmitButton.propTypes = {

}


export default NewActivitySubmitButton;
