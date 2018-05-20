import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, View} from 'styled-x';

// 
import {TouchableHighlight} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';


const NewActivitySubmitButton = ({ handlePress }) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled(TouchableHighlight)`
    height: 44
    paddingVertical: 11
    alignItems: center
    backgroundColor: ${Colors.primary}
    borderRadius: 6
  `;

  const Content = styled.View`
    flex: 1
    alignItems: center
    justifyContent: center
  `;

  const ButtonText = styled.Text`
    ${TextStyles.mediumBold(Colors.text.whiteGray)}
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <ButtonText>
        {'ADD NEW'}
      </ButtonText>
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
NewActivitySubmitButton.propTypes = {

}


export default NewActivitySubmitButton;
