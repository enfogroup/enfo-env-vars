import { MaybeUndefined } from '@models/common';
import { BooleanConfig, CustomParserFunction, ExtendedParserFunction, JSONConfig, NumericalConfig, ParserFunctions, StringConfig, VariableTypeBarJSON } from '@models/functions';
import { VariableType } from '@models/parse';
import { parseVariable } from './parse';

/**
 * Internal function used for all types of parsing
 * @param type
 * VariableType value
 * @returns
 * T or undefined
 */
const parseEnvGenericSimple = <T, U extends object>(type: VariableType): ParserFunctions<T, U> => {
  const parseFunction: ParserFunctions<T, U> = (name: string, other?: T | CustomParserFunction<T> | U): any => {
    if (!other) {
      return parseVariable({
        type,
        name
      }) as MaybeUndefined<T>;
    } else if (typeof other === 'function') {
      const value: MaybeUndefined<T> = parseVariable({
        type,
        name
      });
      return (other as CustomParserFunction<T>)(value);
    } else {
      return parseVariable({
        type,
        name,
        ...other
      }) as MaybeUndefined<T>;
    }
  };

  return parseFunction;
};

/**
 * Internal function used for parsing all types of values except JSON
 * @param type
 * VariableType value
 * @param variableType
 * Value to use for typeof comparison
 * @returns
 * T or undefined
 */
const parseEnvGeneric = <T, U extends object>(type: VariableTypeBarJSON, variableType: 'string' | 'number' | 'boolean'): ExtendedParserFunction<TypeError, U> => {
  const parseFunction: ExtendedParserFunction<T, U> = (name: string, other?: T | CustomParserFunction<T> | U): any => {
    // eslint-disable-next-line valid-typeof
    if (typeof other === variableType) {
      return parseVariable({
        type,
        name,
        defaultValue: (other as any)
      });
    }
    return parseEnvGenericSimple<T, U>(type)(name, (other as any));
  };

  return parseFunction as any;
};

export const parseEnvString = parseEnvGeneric<string, StringConfig>(VariableType.STRING, 'string');
export const parseEnvNumerical = parseEnvGeneric<number, NumericalConfig>(VariableType.NUMBER, 'number');
export const parseEnvBoolean = parseEnvGeneric<boolean, BooleanConfig>(VariableType.BOOLEAN, 'boolean');
export const parseEnvJSON = parseEnvGenericSimple<object, JSONConfig>(VariableType.JSON);
