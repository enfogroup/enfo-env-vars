import { BooleanVariable, NumericalVariable, ParseParameters, Variable, VariableType } from '@models/parse';

/**
 * List of truthy values checked by default, can be extended in ParseParameters
 */
export const truthyValues = ['true', '1', 'yes'];

/**
 * Parses process.env according to config.
 * @param params
 * See interface definition
 * @returns
 * Object containing the parsed variables
 */
export const parse = <T>(params: ParseParameters): T => {
  const result: any = {};
  params.variables.forEach((config: Variable) => {
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
 * Variable config
 * @param value
 * Variable value as string or undefined
 * @throws
 * If value is undefined when required or regex does not match for string
 */
export const validateValue = (config: Variable, value: string | undefined): void => {
  if (value === undefined) {
    if (config.required) {
      throw new Error(`No value found for ${config.name}. This variable is required and a value must be set.`);
    }
    return;
  }

  if (config.type === VariableType.STRING) {
    if (!config.regex) {
      return;
    }
    const regex = new RegExp(config.regex);
    if (!regex.test(value)) {
      throw new Error(`Value for ${config.name} (${value}) does not match regular expression: ${config.regex}`);
    }
  }
};

/**
 * Parses a value to the supplied type. Returns default value (if defined) if the value is undefined
 * @param config
 * Variable config
 * @param value
 * Variable value as string or undefined
 * @throws
 * If variable type is not a proper value
 */
export const parseVariable = (config: Variable, value: string | undefined): any => {
  if (value === undefined) {
    return config.defaultValue;
  }
  switch (config.type) {
    // istanbul ignore next
    case VariableType.STRING:
      return parseString(value);
    // istanbul ignore next
    case VariableType.NUMBER:
      return parseNumber(config, value);
    // istanbul ignore next
    case VariableType.BOOLEAN:
      return parseBoolean(config, value);
    // istanbul ignore next
    case VariableType.JSON:
      return parseJSON(value);
    default:
      throw new Error(`Unknown variable type. Type should be one of ${Object.values(VariableType)}`);
  }
};

/**
 * Parses a string
 * @param value
 * Value as string
 */
export const parseString = (value: string): string => {
  return value;
};

/**
 * Parses a number. Non-number values will result in an error being thrown
 * @param config
 * NumericalVariable object
 * @param value
 * Value as string
 * @throws
 * If value is not a string representation of a number
 */
export const parseNumber = (config: NumericalVariable, value: string): number => {
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(`Unable to parse ${config.name} to number, ${value} is not a number`);
  }
  return parsed;
};

/**
 * Parses a value as boolean using a preset list of truthy values. Fallback is set to false.
 * @param config
 * BooleanVariable object
 * @param value
 * Value as string
 */
export const parseBoolean = (config: BooleanVariable, value: string): boolean => {
  return truthyValues.concat(...(config.truthyValues || [])).includes(value.toLowerCase());
};

/**
 * Parses value as JSON
 * @param value
 * Stringified JSON
 */
export const parseJSON = (value: string): object => {
  return JSON.parse(value);
};
