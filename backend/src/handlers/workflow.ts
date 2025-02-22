import { Request, Response } from "express";
import { TwilioService } from "../services/twilio";
import { prisma } from "../db";

export async function handleWorkflowAction(req: Request, res: Response) {
  try {
    const { portalId, message, phoneProperty, objectId, objectType } = req.body;
    
    const account = await prisma.account.findFirst({
      where: { hubspotPortalId: portalId }
    });

    if (!account?.twilioAccountSid || !account?.twilioAuthToken) {
      throw new Error("Twilio credentials not configured");
    }

    const twilioService = new TwilioService(
      account.twilioAccountSid,
      account.twilioAuthToken
    );

    const result = await twilioService.sendSms(phoneProperty, message, account.id);

    res.json({
      messageId: result.sid,
      status: result.status
    });
  } catch (error) {
    console.error("Workflow action error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
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
      throw new Error("Account not found");
    }

    const twilioService = new TwilioService(
      account.twilioAccountSid!,
      account.twilioAuthToken!
    );

    await twilioService.handleIncomingSms(From, Body, MessageSid, account.id);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
