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

/**
 * Parses process.env according to config.
 * @param config
 */
export const parse = (config: VariableConfig[]): any => {
  const result: any = {};
  config.forEach((config: VariableConfig) => {
    const value = getValue(config.name);
    validateValue(config, value);
    result[config.name] = parseVariable(config, value);
  });

  return result;
};

/**
 * Gets value (or undefined) from process.env
 * @param name
 */
export const getValue = (name: string): string | undefined => {
  return process.env[name];
};

/**
 * Checks if a required value is defined and if a value matches a regular expression
 * @param config
 * @param value
 */
export const validateValue = (config: VariableConfig, value: string | undefined): void => {
  if (value === undefined) {
    if (config.required) {
      throw new Error(`No value found for ${config.name}. This variable is required and a value must be set.`);
    }
  } else {
    if (config.regex) {
      const regex = new RegExp(config.regex);
      if (!regex.test(value)) {
        throw new Error(`Value for ${config.name} (${value}) does not match regular expression: ${config.regex}`);
      }
    }
  }
};

/**
 * Parses a value to the supplied type. Returns default value (if defined) if the value is undefined
 * @param config
 * @param value
 */
export const parseVariable = (config: VariableConfig, value: string | undefined): any => {
  if (value === undefined) {
    return config.defaultValue;
  }
  switch (config.type) {
    case VariableType.STRING:
      return parseString(value);
    case VariableType.NUMBER:
      return parseNumber(config, value);
    case VariableType.ENUM:
      return parseEnum(config, value);
    case VariableType.BOOLEAN:
      return parseBoolean(value);
    case VariableType.JSON:
      return parseJSON(value);
    default:
      throw new Error(`Unknown variable type. Type should be one of ${Object.values(VariableType)}`);
  }
};

/**
 * Parses a string
 * @param value
 */
export const parseString = (value: string): string => {
  return value;
};

/**
 * Parses a number. Non-number values will result in an error being thrown
 * @param config
 * @param value
 */
export const parseNumber = (config: VariableConfig, value: string): number => {
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(`Unable to parse ${config.name} to number, ${value} is not a number`);
  }
  return parsed;
};

/**
 * Checks if a value belongs to an enum
 * @param config
 * @param value
 */
export const parseEnum = (config: VariableConfig, value: string): any => {
  if (!config.enum) {
    throw new Error(`No enum has been supplied for ${config.name} despite it having enum type`);
  }

  if (!Array.isArray(config.enum)) {
    throw new Error(`The enum specified for ${config.name} is not an array`);
  }

  if (!config.enum.includes(value)) {
    throw new Error(`Value for ${config.name} (${value}) does not match values in enum: ${config.enum.join(', ')}`);
  }
  return value;
};

export const truthyValues = ['true', '1', 'yes'];
/**
 * Parses a value as boolean using a preset list of truthy values. Fallback is set to false.
 * @param value
 */
export const parseBoolean = (value: string): boolean => {
  return truthyValues.includes(value.toLowerCase());
};

/**
 * Parses value as JSON
 * @param value
 */
export const parseJSON = (value: string): any => {
  return JSON.parse(value);
};
