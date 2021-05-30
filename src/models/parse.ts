/**
 * The available variable types
 */
export enum VariableType {
  /**
   * String variable
   */
  STRING = 'string',
  /**
   * Numerical variable
   */
  NUMBER = 'number',
  /**
   * Boolean variable
   */
  BOOLEAN = 'boolean',
  /**
   * JSON variable
   */
  JSON = 'json'
}

/**
 * Used as a base for all variables
 */
interface BaseVariable<T> {
  /**
   * Name of variable in process.env
   */
  name: string;
  /**
   * Type of variable
   */
  type: VariableType;
  /**
   * Default value for variable, used if required is false and no value is found
   */
  defaultValue?: T;
  /**
   * When set the variable must be found in process.env, otherwise an error will be thrown
   */
  required?: boolean;
}

/**
 * String variable configuration, used by parseVariables
 */
export interface StringVariable extends BaseVariable<string> {
  type: VariableType.STRING;
  /**
   * Regular expression to check the string against
   */
  regex?: string | RegExp;
}

/**
 * Numerical variable configuration, used by parseVariables
 */
export interface NumericalVariable extends BaseVariable<number> {
  type: VariableType.NUMBER;
}

/**
 * Boolean variable configuration, used by parseVariables
 */
export interface BooleanVariable extends BaseVariable<boolean> {
  /**
   * List of values to be considered truthy when parsing boolean variables
   */
  truthyValues?: string[];
  type: VariableType.BOOLEAN;
}

/**
 * JSON variable configuration, used by parseVariables
 */
export interface JSONVariable extends BaseVariable<object> {
  type: VariableType.JSON
}

/**
 * Configuration used by string parsing function
 */
export type StringConfig = Omit<StringVariable, 'name' | 'type'>
/**
 * Configuration used by numerical parsing function
 */
export type NumericalConfig = Omit<NumericalVariable, 'name' | 'type'>
/**
 * Configuration used by boolean parsing function
 */
export type BooleanConfig = Omit<BooleanVariable, 'name' | 'type'>
/**
 * Configuration used by JSON parsing function
 */
export type JSONConfig = Omit<JSONVariable, 'name' | 'type'>

/**
 * A variable to parse
 */
export type Variable = StringVariable | NumericalVariable | BooleanVariable | JSONVariable;

/**
 * Parameters to pass to parse function
 */
export interface ParseParameters {
  /**
   * List of variables to parse
   */
  variables: Variable[];
}

/**
 * Parses process.env value
 */
export type CustomParserFunction<T> = (value?: T) => T
