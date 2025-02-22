import { WorkflowActionDefinition } from './types';

export const sendSmsAction: WorkflowActionDefinition = {
  actionName: 'send-sms',
  objectTypes: ['CONTACT', 'COMPANY', 'DEAL', 'TICKET'],
  inputFields: [
    {
      name: 'message',
      type: 'TEXT',
      label: 'Message',
      required: true
    },
    {
      name: 'phoneProperty',
      type: 'PROPERTY',
      label: 'Phone Number Property',
      propertyTypes: ['PHONE'],
      required: true
    }
  ],
  outputFields: [
    {
      name: 'messageId',
      type: 'TEXT',
      label: 'Message ID'
    },
    {
      name: 'status',
      type: 'TEXT',
      label: 'Status'
    }
  ]
};
