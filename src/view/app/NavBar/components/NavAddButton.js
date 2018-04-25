import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';

// Using the react-native component until this issue is resolved:
// https://github.com/lelandrichardson/react-primitives/issues/71.
import {TouchableHighlight} from 'react-native';
import {Text, TextInput, View} from 'styled-x';

// Redux
import { connect } from 'react-redux'
import {
  openAddActivityModal,
  closeAddActivityModal,
} from 'src/redux/actions/app/screenState';

// Styles
import Colors from 'src/view/styles/colors';
import { getCircleStyle } from 'src/view/styles/views';

// Components
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getAddActivityModalState } from 'src/redux/selectors/appSelectors';

const NavAddButton = ({
  isAddActivityModalOpen,
  openAddActivityModal,
  closeAddActivityModal,
}) => {

  // --------------------------------------------------
  // Styles / Styled Components
  // --------------------------------------------------

  const buttonSize = 60;

  const Container = styled(TouchableHighlight)`
    ${getCircleStyle(buttonSize)}
    backgroundColor: ${Colors.primary}
    justifyContent: center
    alignItems: center
    shadow-opacity: 0.50;
    shadow-radius: 2px;
    shadow-color: ${Colors.shadows.darkGray};
    shadow-offset: 0px 4px;
  `;

  // --------------------------------------------------
  // Event Handlers
  // --------------------------------------------------

  const handleOnPress = () => {
    isAddActivityModalOpen ? closeAddActivityModal() : openAddActivityModal();
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <Container
      onPress={handleOnPress}>
      <Icon
        name={'plus'}
        size={30}
        color={Colors.white}
      />
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
NavAddButton.propTypes = {
  isAddActivityModalOpen: PropTypes.bool.isRequired,
  openAddActivityModal: PropTypes.func.isRequired,
  closeAddActivityModal: PropTypes.func.isRequired,
}

export default connect(

  // mapStateToProps
  (state, props) => ({
    isAddActivityModalOpen: getAddActivityModalState(state),
  }),

  // mapDispatchToProps
  dispatch => ({
    openAddActivityModal: () => dispatch(openAddActivityModal()),
    closeAddActivityModal: () => dispatch(closeAddActivityModal()),
  }),
)(NavAddButton);