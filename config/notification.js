import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

export function setupNotificationListener() {
  messaging().onMessage(async remoteMessage => {
    console.log(
      'Foreground notification:',
      remoteMessage
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
      },
      trigger: null,
    });
  });
}

export async function registerForPushNotifications() {
  try {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission denied');
      return null;
    }

    const token = await messaging().getToken();

    console.log('FCM Token:', token);

    return token;

  } catch (error) {
    console.log('FCM registration error:', error);
    return null;
  }
}