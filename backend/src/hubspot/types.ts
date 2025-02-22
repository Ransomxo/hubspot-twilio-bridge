export interface CrmCardDefinition {
  title: string;
  fetch: {
    objectTypes: string[];
    targetUrl: string;
    propertiesToSend: string[];
  };
  display: {
    properties: {
      name: string;
      label: string;
      dataType: string;
    }[];
    actions: {
      type: string;
      width: number;
      height: number;
      uri: string;
      label: string;
    }[];
  };
}
