import express, { Router } from 'express';
import { handleCrmCardFetch, handleSendSms } from '../handlers/crm-card';
import { handleTwilioWebhook } from '../handlers/workflow';

const router: Router = express.Router();

router.post('/crm-card', handleCrmCardFetch as express.RequestHandler);
router.post('/send-sms', handleSendSms as express.RequestHandler);
router.post('/webhook/twilio/:portalId', handleTwilioWebhook as express.RequestHandler);

export default router;
