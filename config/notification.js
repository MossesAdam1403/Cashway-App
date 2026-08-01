import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

async function displayNotification(title, body) {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'cashway',
    },
  });
}

async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'cashway_v1',
    name: 'CashWay Notifications',
    sound: 'cashway_sound',
    importance: 4,
  });
}

export function setupNotificationListener() {
  messaging().onMessage(async remoteMessage => {
    console.log(
      'Foreground notification:',
      remoteMessage
    );

    await displayNotification(
      remoteMessage.notification?.title || 'CashWay_v1',
      remoteMessage.notification?.body || 'You have a new update'
    );
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