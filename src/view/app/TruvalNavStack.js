import { SwitchNavigator, StackNavigator } from 'react-navigation';
import AuthLoadingScreen from 'src/view/app/AuthLoadingScreen';
import SessionScreen from 'src/view/app/SessionScreen';
import AddActivityModal from 'src/view/app/AddActivityModal';


console.log('inside truvalnavstack');
const AppStack = StackNavigator(
  {
    SessionScreen: {
      screen: SessionScreen,
    },
    AddActivityModal: {
      screen: AddActivityModal,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const RootStack = StackNavigator(

  // RouteConfigs
  {
    AuthLoading: {
      screen: AuthLoadingScreen,
    },
    AppStack: {
      screen: AppStack,
    },
  },

  // StackNavigatorConfig
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
  },
);


export default RootStack;