
import { WebhookPayload } from '@/types';

const WEBHOOK_URL = 'https://webhook.lanuevadigital.com/webhook/koto';

export const sendInvitationWebhook = async (payload: WebhookPayload): Promise<boolean> => {
  try {
    console.log('Sending webhook to:', WEBHOOK_URL);
    console.log('Payload:', payload);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook failed with status:', response.status);
      return false;
    }

    console.log('Webhook sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending webhook:', error);
    return false;
  }
};
