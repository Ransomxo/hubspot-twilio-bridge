export interface WorkflowActionDefinition {
  actionName: string;
  objectTypes: string[];
  inputFields: {
    name: string;
    type: string;
    label: string;
    required: boolean;
    propertyTypes?: string[];
  }[];
  outputFields: {
    name: string;
    type: string;
    label: string;
  }[];
}
