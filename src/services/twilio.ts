import { Twilio } from 'twilio';
import { prisma } from '../db';

export class TwilioService {
  private client: Twilio;
  
  constructor(accountSid: string, authToken: string) {
    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, message: string, accountId: string) {
    try {
      const result = await this.client.messages.create({
        body: message,
        to,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      await prisma.smsBilling.create({
        data: {
          accountId,
          messageId: result.sid,
          status: result.status,
          cost: 0.01 // Example cost per SMS
        }
      });

      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async handleIncomingSms(from: string, body: string, messageId: string, accountId: string) {
    try {
      await prisma.smsBilling.create({
        data: {
          accountId,
          messageId,
          status: 'received',
          cost: 0.01 // Example cost per received SMS
        }
      });

      return { from, body, messageId };
    } catch (error) {
      console.error('Error handling incoming SMS:', error);
      throw error;
    }
  }
}
