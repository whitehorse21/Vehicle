import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/navigation/register_screens';
import {initializePushNotifications} from './src/notifications';
import {
  goToAuth,
  startInitialisation,
} from './src/navigation/navigation_settings';
import {getData} from './src/storage';
import {colors} from './src/colors';

const setDefaultOptions = () =>
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      height: 0,
    },
    layout: {
      backgroundColor: colors.lightBlue,
      orientation: ['portrait'],
    },
  });

registerScreens();
Navigation.events().registerAppLaunchedListener(async () => {
  await initializePushNotifications();
  setDefaultOptions();
  const userToken = JSON.parse(await getData('token'));
  const userType = JSON.parse(await getData('userType'));
  const userVehicle = JSON.parse(await getData('userVehicle'));
  if (userToken && userType) {
    if (userType === 'carrier' && !userVehicle) {
      goToAuth();
    } else {
      startInitialisation();
    }
  } else {
    goToAuth();
  }
});
