import { Request, Response } from 'express';
import { Client } from '@hubspot/api-client';
import { TwilioService } from '../services/twilio';
import { prisma } from '../db';
import { HubSpotCrmApi, HubSpotObjectType } from '../hubspot/crm-types';

export async function handleWorkflowAction(req: Request, res: Response) {
  try {
    const { portalId, message, phoneProperty, objectId, objectType } = req.body as {
      portalId: string;
      message: string;
      phoneProperty: string;
      objectId: string;
      objectType: HubSpotObjectType;
    };
    
    const account = await prisma.account.findFirst({
      where: { hubspotPortalId: portalId }
    });

    if (!account?.twilioAccountSid || !account?.twilioAuthToken) {
      throw new Error('Twilio credentials not configured');
    }

    const twilioService = new TwilioService(
      account.twilioAccountSid,
      account.twilioAuthToken
    );

    const hubspotClient = new Client({ apiKey: process.env.HUBSPOT_DEVELOPER_API_KEY });
    
    // Get phone number from HubSpot object
    const crmApi = hubspotClient.crm as unknown as HubSpotCrmApi;
    const objectTypeKey = objectType.toLowerCase();
    const object = await crmApi[objectTypeKey].basicApi.getById(
      objectId,
      [phoneProperty]
    );

    if (!object.properties[phoneProperty]) {
      throw new Error(`Phone number not found in property: ${phoneProperty}`);
    }

    const result = await twilioService.sendSms(
      object.properties[phoneProperty],
      message,
      account.id
    );

    res.json({
      messageId: result.sid,
      status: result.status
    });
  } catch (error) {
    console.error('Workflow action error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export async function handleTwilioWebhook(req: Request, res: Response) {
  try {
    const { From, Body, MessageSid } = req.body;
    const portalId = req.params.portalId;

    const account = await prisma.account.findFirst({
      where: { hubspotPortalId: portalId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const twilioService = new TwilioService(
      account.twilioAccountSid!,
      account.twilioAuthToken!
    );

    await twilioService.handleIncomingSms(From, Body, MessageSid, account.id);

    // Update HubSpot contact with the received message
    const hubspotClient = new Client({ apiKey: process.env.HUBSPOT_DEVELOPER_API_KEY });
    
    try {
      const crmApi = hubspotClient.crm as unknown as HubSpotCrmApi;
    const contact = await crmApi.contacts.basicApi.getById(
        From,
        ['phone', 'last_sms_received']
      );

      await hubspotClient.crm.contacts.basicApi.update(contact.id, {
        properties: {
          last_sms_received: Body
        }
      });
    } catch (error) {
      console.warn('Contact not found in HubSpot, skipping update');
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
