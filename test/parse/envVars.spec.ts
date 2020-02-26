import * as envVars from '../../src/parse/envVars';
import { VariableConfig, VariableType } from '../../src/interfaces/config';

import { checkAllMocksCalled } from '../tools';

describe('index', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('parse', () => {
    it('should be able to parse a single variable', () => {
      const mocks = [
        jest.spyOn(envVars, 'getValue').mockReturnValue('something'),
        jest.spyOn(envVars, 'validateValue').mockReturnValue(undefined),
        jest.spyOn(envVars, 'parseVariable').mockReturnValue('value')
      ];
      const input: VariableConfig[] = [{
        name: 'a',
        type: VariableType.STRING
      }];

      const output = envVars.parse(input);

      expect(output).toEqual({ a: 'value' });
      checkAllMocksCalled(mocks, 1);
    });

    it('should be able to parse a multiple variables', () => {
      const mocks = [
        jest.spyOn(envVars, 'getValue').mockReturnValue('something'),
        jest.spyOn(envVars, 'parseVariable').mockReturnValue('value'),
        jest.spyOn(envVars, 'validateValue').mockReturnValue(undefined)
      ];
      const input: VariableConfig[] = [{
        name: 'a',
        type: VariableType.STRING
      }, {
        name: 'b',
        type: VariableType.STRING
      }, {
        name: 'c',
        type: VariableType.STRING
      }];

      const output = envVars.parse(input);

      expect(output).toEqual({ a: 'value', b: 'value', c: 'value' });
      checkAllMocksCalled(mocks, 3);
    });
  });

  describe('getValue', () => {
    it('should be able to get a string value from process.env', () => {
      const variable = 'bananaPhone';
      const value = 'something';
      process.env[variable] = value;

      const output = envVars.getValue(variable);

      expect(output).toEqual(value);
    });

    it('should return undefined if the value is not defined in process.env', () => {
      const output = envVars.getValue('nowhereToBeFound');

      expect(output).toEqual(undefined);
    });
  });

  describe('validateValue', () => {
    it('should not throw if all is fine', () => {
      const foo = () => {
        envVars.validateValue({ name: 'something', type: VariableType.STRING }, 'defined!');
      };

      expect(foo).not.toThrowError();
    });

    it('should throw if value is undefined and the variable is required', () => {
      const foo = () => {
        envVars.validateValue({ name: 'something', type: VariableType.STRING, required: true }, undefined);
      };

      expect(foo).toThrowError('is required');
    });

    it('should accept value that is undefined and the variable is not required', () => {
      const output = envVars.validateValue({ name: 'something', type: VariableType.STRING }, undefined);

      expect(output).toEqual(undefined);
    });

    it('should not throw if value is defined and matches the regular expression', () => {
      const foo = () => {
        envVars.validateValue({ name: 'something', type: VariableType.STRING, regex: '[a-z]{3}' }, 'abc');
      };

      expect(foo).not.toThrowError();
    });

    it('should throw if value is defined but does not match the regular expression', () => {
      const foo = () => {
        envVars.validateValue({ name: 'something', type: VariableType.STRING, regex: '[a-z]{3}' }, '123');
      };

      expect(foo).toThrowError('regular expression');
    });
  });

  /**
   * We mock functions below to ensure we don't poison coverage results
   * nor force this test suite to make functional requests
   */
  describe('parseVariable', () => {
    it('should return defaultValue if value is undefined', () => {
      const defaultValue = 'abc123';

      const output = envVars.parseVariable({ name: 'something', type: VariableType.STRING, defaultValue }, undefined);

      expect(output).toEqual(defaultValue);
    });

    it('should be able to parse string', () => {
      const mocks = [
        jest.spyOn(envVars, 'parseString').mockReturnValue('string!')
      ];
      const uncalledMocks = [
        jest.spyOn(envVars, 'parseNumber'),
        jest.spyOn(envVars, 'parseEnum'),
        jest.spyOn(envVars, 'parseBoolean'),
        jest.spyOn(envVars, 'parseJSON')
      ];

      envVars.parseVariable({
        name: 'a',
        type: VariableType.STRING
      }, 'variableData');

      checkAllMocksCalled(mocks, 1);
      checkAllMocksCalled(uncalledMocks, 0);
    });

    it('should be able to parse number', () => {
      const mocks = [
        jest.spyOn(envVars, 'parseNumber').mockReturnValue(5)
      ];
      const uncalledMocks = [
        jest.spyOn(envVars, 'parseString'),
        jest.spyOn(envVars, 'parseEnum'),
        jest.spyOn(envVars, 'parseBoolean'),
        jest.spyOn(envVars, 'parseJSON')
      ];

      envVars.parseVariable({
        name: 'a',
        type: VariableType.NUMBER
      }, '123');

      checkAllMocksCalled(mocks, 1);
      checkAllMocksCalled(uncalledMocks, 0);
    });

    it('should be able to parse number', () => {
      const mocks = [
        jest.spyOn(envVars, 'parseEnum').mockReturnValue('abc')
      ];
      const uncalledMocks = [
        jest.spyOn(envVars, 'parseString'),
        jest.spyOn(envVars, 'parseNumber'),
        jest.spyOn(envVars, 'parseBoolean'),
        jest.spyOn(envVars, 'parseJSON')
      ];

      envVars.parseVariable({
        name: 'a',
        type: VariableType.ENUM,
        enum: ['abc']
      }, 'abc');

      checkAllMocksCalled(mocks, 1);
      checkAllMocksCalled(uncalledMocks, 0);
    });

    it('should be able to parse boolean', () => {
      const mocks = [
        jest.spyOn(envVars, 'parseBoolean').mockReturnValue(true)
      ];
      const uncalledMocks = [
        jest.spyOn(envVars, 'parseString'),
        jest.spyOn(envVars, 'parseNumber'),
        jest.spyOn(envVars, 'parseEnum'),
        jest.spyOn(envVars, 'parseJSON')
      ];

      envVars.parseVariable({
        name: 'a',
        type: VariableType.BOOLEAN
      }, 'true');

      checkAllMocksCalled(mocks, 1);
      checkAllMocksCalled(uncalledMocks, 0);
    });

    it('should be able to parse json', () => {
      const mocks = [
        jest.spyOn(envVars, 'parseJSON').mockReturnValue([])
      ];
      const uncalledMocks = [
        jest.spyOn(envVars, 'parseString'),
        jest.spyOn(envVars, 'parseNumber'),
        jest.spyOn(envVars, 'parseEnum'),
        jest.spyOn(envVars, 'parseBoolean')
      ];

      envVars.parseVariable({
        name: 'a',
        type: VariableType.JSON
      }, '[]');

      checkAllMocksCalled(mocks, 1);
      checkAllMocksCalled(uncalledMocks, 0);
    });

    it('should throw an error if type is unknown', () => {
      const uncalledMocks = [
        jest.spyOn(envVars, 'parseString'),
        jest.spyOn(envVars, 'parseNumber'),
        jest.spyOn(envVars, 'parseEnum'),
        jest.spyOn(envVars, 'parseBoolean'),
        jest.spyOn(envVars, 'parseJSON')
      ];

      const foo = () => {
        envVars.parseVariable({
          name: 'a',
          type: 'BANANA_PHONE' as VariableType
        }, 'ring ring');
      };

      expect(foo).toThrowError('Unknown variable type');
      checkAllMocksCalled(uncalledMocks, 0);
    });
  });

  describe('parseString', () => {
    it('should return its input', () => { // a pitiful test, but what can one do?
      const input = 'abc';

      const output = envVars.parseString(input);

      expect(output).toEqual(input);
    });
  });

  describe('parseNumber', () => {
    it('should be able to parse to int', () => {
      const output = envVars.parseNumber({ name: 'a', type: VariableType.NUMBER }, '123');

      expect(output).toEqual(123);
    });

    it('should be able to parse to floating number', () => {
      const output = envVars.parseNumber({ name: 'a', type: VariableType.NUMBER }, '123.45');

      expect(output).toEqual(123.45);
    });

    it('should throw if result is NaN', () => {
      const foo = () => {
        envVars.parseNumber({ name: 'a', type: VariableType.NUMBER }, '123,45');
      };

      expect(foo).toThrowError('is not a number');
    });
  });

  describe('parseEnum', () => {
    it('should be able to accept values', () => {
      const output = envVars.parseEnum({ name: 'a', type: VariableType.ENUM, enum: ['abc'] }, 'abc');

      expect(output).toEqual('abc');
    });

    it('should throw if enum is not configured', () => {
      const foo = () => {
        envVars.parseEnum({ name: 'a', type: VariableType.ENUM }, 'abc');
      };

      expect(foo).toThrowError('No enum has been supplied');
    });

    it('should throw if enum is not an array', () => {
      const foo = () => {
        envVars.parseEnum({
          name: 'a',
          type: VariableType.ENUM,
          enum: 'abc'
        } as unknown as VariableConfig, 'abc');
      };

      expect(foo).toThrowError('not an array');
    });

    it('should throw if enum does not contain value', () => {
      const foo = () => {
        envVars.parseEnum({ name: 'a', type: VariableType.ENUM, enum: ['def', 'ghi'] }, 'abc');
      };

      expect(foo).toThrowError('does not match values in enum');
    });
  });

  describe('parseBoolean', () => {
    it('should be able to parse to true', () => {
      const truthyValues = envVars.truthyValues;

      truthyValues.forEach((value: string) => {
        const output = envVars.parseBoolean(value);

        expect(output).toEqual(true);
      });
    });

    it('should be able to parse capital letters  to true', () => {
      const truthyValues = envVars.truthyValues;

      truthyValues.forEach((value: string) => {
        const output = envVars.parseBoolean(value.toUpperCase());

        expect(output).toEqual(true);
      });
    });

    it('should be able to parse to false', () => {
      const falseyValues = ['false', 'bananaPhone'];

      falseyValues.forEach((value: string) => {
        const output = envVars.parseBoolean(value);

        expect(output).toEqual(false);
      });
    });
  });

  describe('parseJSON', () => {
    it('should be able to parse JSON', () => {
      const output = envVars.parseJSON('{}');

      expect(output).toEqual({});
    });

    it('should be able to parse nested JSON objects', () => {
      const output = envVars.parseJSON('{"a":"b"}');

      expect(output).toEqual({ a: 'b' });
    });
  });
});
