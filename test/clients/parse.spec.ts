// to be tested
import * as parse from '@clients/parse';

// models
import { VariableType } from '@models/parse';

describe('clients/parse', () => {
  beforeEach(() => {
  });
  afterEach(() => {
    delete process.env.ENFO_ENV_VARS_DISABLE_REQUIRED;
  });

  describe('parse', () => {
    it('should parse and compose an object with the parsed variables', () => {
      process.env.parseOne = 'hello world';
      process.env.parseTwo = '4711';

      const output = parse.parseVariables<{ parseOne: string, parseTwo: number }>({
        variables: [{
          name: 'parseOne',
          type: VariableType.STRING
        }, {
          name: 'parseTwo',
          type: VariableType.NUMBER
        }]
      });

      expect(output).toEqual({
        parseOne: 'hello world',
        parseTwo: 4711
      });
    });
  });

  describe('getValue', () => {
    it('should return string value', () => {
      process.env.getValue = 'hello';

      const output = parse.getValue('getValue');

      expect(output).toEqual('hello');
    });

    it('should return undefined', () => {
      const output = parse.getValue('notFound');

      expect(output).toEqual(undefined);
    });
  });

  describe('validateValue', () => {
    it('should accept undefined value is required is false', () => {
      parse.validateValue({ type: VariableType.NUMBER, name: 'a' }, undefined);
    });

    it('should throw if value is undefined and required is true', () => {
      expect(() => {
        parse.validateValue({ type: VariableType.NUMBER, name: 'a', required: true }, undefined);
      }).toThrow('variable is required');
    });

    it('should not throw if value is undefined and ENFO_ENV_VARS_DISABLE_REQUIRED is set to true', () => {
      process.env.ENFO_ENV_VARS_DISABLE_REQUIRED = 'something';
      parse.validateValue({ type: VariableType.NUMBER, name: 'a' }, undefined);
    });

    it('should do nothing if variable type is string and regex is undefined', () => {
      parse.validateValue({ type: VariableType.STRING, name: 'a' }, 'something');
    });

    it('should accept variable value if type is string and the regex matches', () => {
      parse.validateValue({ type: VariableType.STRING, name: 'a', regex: /^[a-z]{5}$/ }, 'hello');
    });

    it('should throw if type is string and the regex does not match', () => {
      expect(() => {
        parse.validateValue({ type: VariableType.STRING, name: 'a', regex: /^[a-z]{5}$/ }, 'broken');
      }).toThrow('does not match');
    });
  });

  describe('parseVariable', () => {
    it('should return default value if value is undefined', () => {
      const output = parse.parseVariable({ type: VariableType.STRING, name: 'a', defaultValue: 'default!' });

      expect(output).toEqual('default!');
    });

    it('should throw if type is not a VariableType', () => {
      expect(() => {
        process.env.shouldThrow = 'banana';
        parse.parseVariable({ type: 'banana' as VariableType, name: 'shouldThrow' });
      }).toThrow('Unknown variable type');
    });
  });

  describe('parseString', () => {
    it('should return value as string', () => {
      const output = parse.parseString('something');

      expect(output).toEqual('something');
    });
  });

  describe('parseNumber', () => {
    it('should parse integer value', () => {
      const output = parse.parseNumber({ type: VariableType.NUMBER, name: 'number' }, '4711');

      expect(output).toEqual(4711);
    });

    it('should parse 0 (zero)', () => {
      const output = parse.parseNumber({ type: VariableType.NUMBER, name: 'number' }, '0');

      expect(output).toEqual(0);
    });

    it('should parse negative value', () => {
      const output = parse.parseNumber({ type: VariableType.NUMBER, name: 'number' }, '-42');

      expect(output).toEqual(-42);
    });

    it('should parse float', () => {
      const output = parse.parseNumber({ type: VariableType.NUMBER, name: 'number' }, '47.11');

      expect(output).toEqual(47.11);
    });

    it('should throw if input is not a number as string', () => {
      expect(() => {
        parse.parseNumber({ type: VariableType.NUMBER, name: 'number' }, 'banana');
      }).toThrow('Unable to parse');
    });
  });

  describe('parseBoolean', () => {
    it('should parse default truthy values to true', () => {
      parse.truthyValues.forEach((truthyValue: string): void => {
        const output = parse.parseBoolean({ type: VariableType.BOOLEAN, name: 'boolean' }, truthyValue);

        expect(output).toEqual(true);
      });
    });

    it('should parse configured truthy values to true', () => {
      const values = ['yarp', 'yup', 'sotrue'];
      values.forEach((truthyValue: string): void => {
        const output = parse.parseBoolean({ type: VariableType.BOOLEAN, name: 'boolean', truthyValues: values }, truthyValue);

        expect(output).toEqual(true);
      });
    });

    it('should parse other values to false', () => {
      const values = ['false', '0', 'no', 'banana'];

      values.forEach((value: string): void => {
        const output = parse.parseBoolean({ type: VariableType.BOOLEAN, name: 'boolean' }, value);

        expect(output).toEqual(false);
      });
    });
  });

  describe('parseJSON', () => {
    it('should parse object', () => {
      const data = { a: 4711, b: true };
      const input = JSON.stringify(data);

      const output = parse.parseJSON(input);

      expect(output).toMatchObject(data);
    });

    it('should parse array', () => {
      const data = [4711, true, 'banana'];
      const input = JSON.stringify(data);

      const output = parse.parseJSON(input);

      expect(output).toMatchObject(data);
    });
  });
});
