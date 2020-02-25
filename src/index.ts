import { VariableConfig, VariableType } from './interfaces/config';

export const parse = (config: VariableConfig[]): any => {
  const result: any = {};
  config.forEach((config: VariableConfig) => {
    const value = getValue(config.name);
    validateValue(config, value);
    result[config.name] = parseType(config, value);
  });

  return result;
};
export default parse;

export const getValue = (name: string): string | undefined => {
  return process.env[name];
};

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

export const parseType = (config: VariableConfig, value: string | undefined): any => {
  if (value === undefined) {
    return config.defaultValue;
  }
  switch (config.type) {
    case VariableType.STRING:
      return parseString(value);
    case VariableType.NUMBER:
      return parseNumber(value);
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

export const parseString = (value: string): string => {
  return value;
};

export const parseNumber = (value: string): number => {
  return Number(value);
};

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

export const truthyValues = ['true'];
export const parseBoolean = (value: string): boolean => {
  return truthyValues.includes(value);
};

export const parseJSON = (value: string): any => {
  return JSON.parse(value);
};
