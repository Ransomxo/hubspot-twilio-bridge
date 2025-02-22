import { Twilio } from "twilio";

export class TwilioService {
  private client: Twilio;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string) {
    this.client = new Twilio(accountSid, authToken);
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || "";
  }

  async sendSms(to: string, message: string, accountId: string) {
    const result = await this.client.messages.create({
      body: message,
      from: this.fromNumber,
      to: to
    });

    return {
      sid: result.sid,
      status: result.status,
      accountId
    };
  }

  async handleIncomingSms(from: string, body: string, messageId: string, accountId: string) {
    // Store the incoming message
    return {
      from,
      body,
      messageId,
      accountId
    };
  }
}
