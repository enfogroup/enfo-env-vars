export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  ENUM = 'enum',
  BOOLEAN = 'boolean',
  JSON = 'json'
}

export interface VariableConfig {
  defaultValue: any;
  name: string;
  regex: string;
  required?: boolean;
  enum?: any[];
  type: VariableType;
}

export interface Update {
  override?: boolean;
  sources?: string[];
  variables: VariableConfig[];
}
