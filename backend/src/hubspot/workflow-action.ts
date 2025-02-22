import { CrmCardDefinition } from './types';

export const smsCrmCard: CrmCardDefinition = {
  title: 'SMS Communications',
  fetch: {
    objectTypes: ['CONTACT', 'COMPANY', 'DEAL', 'TICKET'],
    targetUrl: 'https://app.hubspot-twilio-bridge.com/api/crm-card',
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
        uri: 'https://app.hubspot-twilio-bridge.com/sms-composer',
        label: 'Send SMS'
      }
    ]
  }
};
