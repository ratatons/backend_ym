import axios from 'axios';

export interface PushNotificationPayload {
  to: string;
  sound: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class PushNotificationService {
  private static readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  static async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Validate expo push token format
      if (!expoPushToken.startsWith('ExponentPushToken[')) {
        console.warn('Invalid expo push token format:', expoPushToken);
        return false;
      }

      const payload: PushNotificationPayload = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
      };

      const response = await axios.post(this.EXPO_PUSH_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      console.log('Push notification sent successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return false;
    }
  }

  static async sendJokeNotification(
    expoPushToken: string,
    senderUsername: string
  ): Promise<boolean> {
    return this.sendPushNotification(
      expoPushToken,
      'New Yo Mama Joke 👵',
      `${senderUsername} sent you a joke`,
      { type: 'joke' }
    );
  }
}
