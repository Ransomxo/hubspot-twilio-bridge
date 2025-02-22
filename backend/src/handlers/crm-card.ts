import { Request, Response } from 'express';
import { TwilioService } from '../services/twilio';
import { prisma } from '../db';

export async function handleCrmCardFetch(req: Request, res: Response) {
  try {
    const { portalId, objectType, objectId, properties } = req.body;
    
    const account = await prisma.account.findFirst({
      where: { hubspotPortalId: portalId }
    });

    if (!account) {
      return res.json({
        results: [{
          objectId,
          title: 'SMS Communications',
          status: 'ERROR',
          message: 'Account not configured'
        }]
      });
    }

    // Get the last SMS status for this object
    const lastSms = await prisma.smsBilling.findFirst({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      results: [{
        objectId,
        title: 'SMS Communications',
        properties: {
          lastSmsStatus: lastSms?.status || 'No messages sent',
          lastSmsTimestamp: lastSms?.createdAt || null
        }
      }]
    });
  } catch (error) {
    console.error('CRM card fetch error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export async function handleSendSms(req: Request, res: Response) {
  try {
    const { portalId, to, message } = req.body;
    
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

    const result = await twilioService.sendSms(to, message, account.id);

    res.json({
      messageId: result.sid,
      status: result.status
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
