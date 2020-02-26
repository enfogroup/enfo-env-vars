export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  ENUM = 'enum',
  BOOLEAN = 'boolean',
  JSON = 'json'
}

export interface VariableConfig {
  defaultValue?: any;
  enum?: any[];
  name: string;
  regex?: string;
  required?: boolean;
  type: VariableType;
}

export interface Update {
  override?: boolean;
  sources?: string[];
  variables: VariableConfig[];
}
