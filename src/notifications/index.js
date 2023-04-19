import PushNotification from './push';

export const onNotification = (notification) => {
	if (notification) {
		console.log(notification)
	}
};

export const getDeviceToken = () => PushNotification.getDeviceToken();

export const initializePushNotifications = () => {
	return PushNotification.configure({
		onNotification
	});
};
