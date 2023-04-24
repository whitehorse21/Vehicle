import {
  Notifications,
  Registered,
  PendingNotifications,
} from 'react-native-notifications';

class PushNotification {
  constructor() {
    this.onNotification = null;
    this.deviceToken = null;

    Notifications.registerRemoteNotifications();
    Notifications.events().registerRemoteNotificationsRegistered(event => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken);
      this.deviceToken = event.deviceToken;
    });

    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log('Notification opened by device user', notification.payload);
        console.log(
          `Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`,
        );
        completion();
      },
    );

    Notifications.events().registerNotificationReceivedBackground(
      (notification, completion) => {
        console.log('Notification Received - Background', notification.payload);

        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
      },
    );
  }

  getDeviceToken() {
    return this.deviceToken;
  }

  configure(params) {
    this.onNotification = params.onNotification;
    // NotificationsAndroid.refreshToken();
    return Notifications.getInitialNotification();
    // return PendingNotifications.getInitialNotification();
  }
}

export default new PushNotification();
