// import AuthLoadingScreen from './AuthLoadingScreen';


import React, {Component} from 'react';
import styled from "styled-components";
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';
import {Button} from 'react-native';

// Styles
import Colors from 'src/view/styles/colors';


const AuthLoadingScreen = ({navigation}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------
  const Container = styled.View`
    flex: 1
    backgroundColor: blue
    justifyContent: center
    alignItems: center
  `;

  
  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container>
      <View style={{height: 200, width: 200, backgroundColor: 'black'}} >
      </View>
      <Button
        onPress={
          () => navigation.navigate(
            'AppStack', {}, {
              type: 'Navigate',
              routeName: 'SessionScreen',
              params: {
                sessionId: '997a5210-33d1-4198-a4a4-5f1ea477cc01',
              },
            },
          )
        }
        title={'press me'}
        color={'gray'}
      />
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AuthLoadingScreen.propTypes = {
  navigation: PropTypes.navigation.isRequired,
}

export default AuthLoadingScreen;

