// to be tested
import * as parse from '@clients/parse';

// models
import { VariableType } from '@models/parse';

describe('clients/parse', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });

  describe('parse', () => {
    it('should parse and compose an object with the parsed variables', () => {
      process.env.parseOne = 'hello world';
      process.env.parseTwo = '4711';

      const output = parse.parse<{ parseOne: string, parseTwo: number }>({
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
      parse.validateValue({ type: VariableType.NUMBER, name: '' }, undefined);
    });

    it('should throw if value is undefined and required is true', () => {
      expect(() => {
        parse.validateValue({ type: VariableType.NUMBER, name: '', required: true }, undefined);
      }).toThrow('variable is required');
    });

    it('should do nothing if variable type is string and regex is undefined', () => {
      parse.validateValue({ type: VariableType.STRING, name: '' }, 'something');
    });

    it('should accept variable value if type is string and the regex matches', () => {
      parse.validateValue({ type: VariableType.STRING, name: '', regex: /^[a-z]{5}$/ }, 'hello');
    });

    it('should throw if type is string and the regex does not match', () => {
      expect(() => {
        parse.validateValue({ type: VariableType.STRING, name: '', regex: /^[a-z]{5}$/ }, 'broken');
      }).toThrow('does not match');
    });
  });

  describe('parseVariable', () => {

  });

  describe('parseString', () => {

  });

  describe('parseNumber', () => {

  });

  describe('parseBoolean', () => {

  });

  describe('parseJSON', () => {

  });
});
