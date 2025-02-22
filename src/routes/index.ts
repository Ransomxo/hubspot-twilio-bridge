import express from 'express';
import { handleWorkflowAction, handleTwilioWebhook } from '../handlers/workflow';

const router = express.Router();

router.post('/workflow/send-sms', handleWorkflowAction);
// Add portalId parameter to match implementation
router.post('/webhook/twilio/:portalId', handleTwilioWebhook);

export default router;
