import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';

// Styles
import Colors from 'src/view/styles/colors';

// Components
import NavAddButton from './components/NavAddButton';
import NavGraphButton from './components/NavGraphButton';
import NavUserButton from './components/NavUserButton';


const NavBar = ({}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View`
    flex: 1
    flexDirection: row
    paddingBottom: 10
    justifyContent: space-evenly
    alignItems: flex-end
  `;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Container>
      <NavGraphButton />
      <NavAddButton />
      <NavUserButton />
    </Container>
  );

}

NavBar.propTypes = {};



export default NavBar;