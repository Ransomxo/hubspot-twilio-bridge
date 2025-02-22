import { Request, Response } from 'express';
import { handleWorkflowAction, handleTwilioWebhook } from '../workflow';
import { prisma } from '../../db';
import { TwilioService } from '../../services/twilio';

jest.mock('../../db', () => ({
  prisma: {
    account: {
      findFirst: jest.fn()
    },
    smsBilling: {
      create: jest.fn()
    }
  }
}));

jest.mock('@hubspot/api-client', () => ({
  Client: jest.fn().mockImplementation(() => ({
    crm: {
      contact: {
        basicApi: {
          getById: jest.fn().mockResolvedValue({
            id: 'test-contact-id',
            properties: {
              phone: '+1234567890'
            }
          }),
          update: jest.fn().mockResolvedValue({})
        }
      },
      company: {
        basicApi: {
          getById: jest.fn().mockResolvedValue({
            id: 'test-company-id',
            properties: {
              phone: '+1234567890'
            }
          })
        }
      },
      deal: {
        basicApi: {
          getById: jest.fn().mockResolvedValue({
            id: 'test-deal-id',
            properties: {
              phone: '+1234567890'
            }
          })
        }
      },
      ticket: {
        basicApi: {
          getById: jest.fn().mockResolvedValue({
            id: 'test-ticket-id',
            properties: {
              phone: '+1234567890'
            }
          })
        }
      }
    }
  }))
}));

jest.mock('../../services/twilio');

describe('Workflow Handler Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('handleWorkflowAction', () => {
    beforeEach(() => {
      mockReq = {
        body: {
          portalId: 'test-portal',
          message: 'Test message',
          phoneProperty: 'phone',
          objectId: 'test-contact',
          objectType: 'CONTACT'
        }
      };
    });

    it('should send SMS successfully', async () => {
      const mockAccount = {
        id: 'test-account',
        twilioAccountSid: 'test-sid',
        twilioAuthToken: 'test-token'
      };

      (prisma.account.findFirst as jest.Mock).mockResolvedValue(mockAccount);
      (TwilioService.prototype.sendSms as jest.Mock).mockResolvedValue({
        sid: 'test-message-id',
        status: 'sent'
      });

      await handleWorkflowAction(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        messageId: 'test-message-id',
        status: 'sent'
      });
    });

    it('should handle missing Twilio credentials', async () => {
      (prisma.account.findFirst as jest.Mock).mockResolvedValue({
        id: 'test-account'
      });

      await handleWorkflowAction(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Twilio credentials not configured'
      });
    });
  });

  describe('handleTwilioWebhook', () => {
    beforeEach(() => {
      mockReq = {
        body: {
          From: '+1234567890',
          Body: 'Test message',
          MessageSid: 'test-message-id'
        },
        params: {
          portalId: 'test-portal'
        }
      };
    });

    it('should handle incoming SMS successfully', async () => {
      const mockAccount = {
        id: 'test-account',
        twilioAccountSid: 'test-sid',
        twilioAuthToken: 'test-token'
      };

      (prisma.account.findFirst as jest.Mock).mockResolvedValue(mockAccount);

      await handleTwilioWebhook(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('OK');
    });
  });
});
