export type HubSpotObjectType = 'CONTACT' | 'COMPANY' | 'DEAL' | 'TICKET';

export interface HubSpotObject {
  id: string;
  properties: Record<string, string>;
}

export interface HubSpotCrmApi {
  [key: string]: {
    basicApi: {
      getById: (id: string, properties: string[]) => Promise<HubSpotObject>;
      update: (id: string, data: { properties: Record<string, string> }) => Promise<void>;
    };
  };
}
