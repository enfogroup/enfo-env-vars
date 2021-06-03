import { MaybeUndefined } from './common';
import { BooleanVariable, JSONVariable, NumericalVariable, StringVariable, VariableType } from './parse';

/**
 * Function signatures used for stand alone parsing functions
 */
export type ParserFunctions<T, U extends object> = {
  /**
   * Returns value of variable from process.env. No validation is applied
   * @param name
   * Name of variable
   */
  (name: string): MaybeUndefined<T>
  /**
   * Grabs value from process.env and then runs a custom parser function on it
   * @param name
   * Name of variable
   * @param parser
   * Function to run on value from process.env
   */
  (name: string, parser: CustomParserFunction<T>): T
  /**
   * Inline function for parsing value from process.env
   * @param name
   * Name of variable
   * @param config
   * Configuration rules to apply to value
   */
  (name: string, config: U): MaybeUndefined<T>
}

/**
 * Function signatures used by string, numerical and boolean parsing
 */
export type ExtendedParserFunction<T, U extends object> = ParserFunctions<T, U> & {
  /**
   * Returns value of variable from process.env. If the value is not defined the default value is used
   * @param name
   * Name of variable
   * @param defaultValue
   * Value to use if variable isn't found
   */
  (name: string, defaultValue: T): T
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
 * Parses process.env value
 */
export type CustomParserFunction<T> = (value?: T) => T

/**
 * VariableType enum bar JSON type
 */
export type VariableTypeBarJSON = Exclude<VariableType, VariableType.JSON>
