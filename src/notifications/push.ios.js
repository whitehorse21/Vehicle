import {AppState} from 'react-native';
// import NotificationsIOS from 'react-native-notifications';
import {Notifications} from 'react-native-notifications';
class PushNotification {
  constructor() {
    this.onNotification = null;
    this.deviceToken = null;

    // NotificationsIOS.requestPermissions();
    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered(event => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken);
      this.deviceToken = event.deviceToken;
    });

    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        const appState = AppState.currentState;
        if (appState && appState === 'background') {
          this.onNotification(notification);
        }
        completion();
      },
    );
  }

  getDeviceToken() {
    return this.deviceToken;
  }

  async configure(params) {
    this.onNotification = params.onNotification;
    const initial = await Notifications.getInitialNotification();
    console.log('Initial ==== ', initial);
    return Promise.resolve(initial);
  }
}

export default new PushNotification();
