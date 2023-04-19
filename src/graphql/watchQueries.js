import apolloClient from './client';
import {GET_NOTIFICATIONS} from './queries';

let notificationObservable = null;

export const startNotificationPolling = async () => {
  try {
    notificationObservable = await apolloClient.watchQuery({
      query: GET_NOTIFICATIONS,
      fetchPolicy: 'no-cache',
      pollInterval: 500
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getNotificationObservable = () => notificationObservable