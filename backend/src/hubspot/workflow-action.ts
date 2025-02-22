import { CrmCardDefinition } from './types';

export const smsCrmCard: CrmCardDefinition = {
  title: 'SMS Communications',
  fetch: {
    objectTypes: ['CONTACT', 'COMPANY', 'DEAL', 'TICKET'],
    targetUrl: process.env.APP_URL ? `${process.env.APP_URL}/api/crm-card` : 'http://localhost:3000/api/crm-card',
    propertiesToSend: ['phone', 'mobilephone']
  },
  display: {
    properties: [
      {
        name: 'lastSmsStatus',
        label: 'Last SMS Status',
        dataType: 'STRING'
      },
      {
        name: 'lastSmsTimestamp',
        label: 'Last SMS Time',
        dataType: 'DATETIME'
      }
    ],
    actions: [
      {
        type: 'IFRAME',
        width: 890,
        height: 748,
        uri: process.env.APP_URL ? `${process.env.APP_URL}/sms-composer` : 'http://localhost:3000/sms-composer',
        label: 'Send SMS'
      }
    ]
  }
};
