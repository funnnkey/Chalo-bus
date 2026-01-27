import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleBusArrivalNotification(
    busNumber: string,
    stopName: string,
    arrivalTime: number
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Bus ${busNumber} Arriving Soon!`,
        body: `Your bus will reach ${stopName} in ${arrivalTime} minutes`,
        sound: true,
      },
      trigger: {
        seconds: Math.max((arrivalTime - 2) * 60, 30),
      },
    });
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}