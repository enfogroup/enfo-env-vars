// to be tested
import * as functions from '@clients/functions';

// models

describe('clients/functions', () => {
  beforeEach(() => {
  });
  afterEach(() => {
    delete process.env.ENFO_ENV_VARS_DISABLE_REQUIRED;
  });

  describe('string', () => {
    it('should return value from process.env - set', () => {
      process.env.stringOne = 'set';

      const output = functions.parseEnvString('stringOne');

      expect(output).toEqual('set');
    });

    it('should return value from process.env - undefined', () => {
      const output = functions.parseEnvString('stringTwo');

      expect(output).toEqual(undefined);
    });

    it('should ignore default value is variable is defined', () => {
      process.env.stringThree = 'ignoringDefault';

      const output = functions.parseEnvString('stringThree', 'fallback');

      expect(output).toEqual('ignoringDefault');
    });

    it('should use default value if variable is not defined', () => {
      const output = functions.parseEnvString('stringFour', 'fallback');

      expect(output).toEqual('fallback');
    });

    it('should use the parser function', () => {
      process.env.stringFive = 'fizz';

      const output = functions.parseEnvString('stringFive', (value?: string) => {
        if (!value) {
          return 'soUndefined';
        }
        return value + 'buzz';
      });

      expect(output).toEqual('fizzbuzz');
    });

    it('should respect StringConfig', () => { // not bothering to test much more here
      expect(() => {
        functions.parseEnvString('stringSix', {
          required: true
        });
      }).toThrow();
    });
  });

  describe('numerical', () => {
    it('should return value from process.env - set', () => {
      process.env.numberOne = '1';

      const output = functions.parseEnvNumerical('numberOne');

      expect(output).toEqual(1);
    });

    it('should return value from process.env - undefined', () => {
      const output = functions.parseEnvNumerical('numberTwo');

      expect(output).toEqual(undefined);
    });

    it('should ignore default value is variable is defined', () => {
      process.env.numberThree = '3';

      const output = functions.parseEnvNumerical('numberThree', 42);

      expect(output).toEqual(3);
    });

    it('should use default value if variable is not defined', () => {
      const output = functions.parseEnvNumerical('numberFour', 13);

      expect(output).toEqual(13);
    });

    it('should use the parser function', () => {
      process.env.numberFive = '10';

      const output = functions.parseEnvNumerical('numberFive', (value?: number) => {
        if (!value) { return 0; }
        return value * 11;
      });

      expect(output).toEqual(110);
    });

    it('should respect StringConfig', () => { // not bothering to test much more here
      expect(() => {
        functions.parseEnvNumerical('numberSix', {
          required: true
        });
      }).toThrow();
    });
  });

  describe('boolean', () => {
    it('should return value from process.env - set', () => {
      process.env.booleanOne = 'true';

      const output = functions.parseEnvBoolean('booleanOne');

      expect(output).toEqual(true);
    });

    it('should return value from process.env - undefined', () => {
      const output = functions.parseEnvBoolean('booleanTwo');

      expect(output).toEqual(undefined);
    });

    it('should ignore default value is variable is defined', () => {
      process.env.booleanThree = 'false';

      const output = functions.parseEnvBoolean('booleanThree', true);

      expect(output).toEqual(false);
    });

    it('should use default value if variable is not defined', () => {
      const output = functions.parseEnvBoolean('booleanFour', true);

      expect(output).toEqual(true);
    });

    it('should use the parser function', () => {
      process.env.booleanFive = 'false';

      const output = functions.parseEnvBoolean('booleanFive', (value?: boolean) => {
        if (!value) { return true; }
        return false;
      });

      expect(output).toEqual(true);
    });

    it('should respect StringConfig', () => { // not bothering to test much more here
      expect(() => {
        functions.parseEnvBoolean('booleanSix', {
          required: true
        });
      }).toThrow();
    });
  });

  describe('json', () => {
    it('should return value from process.env - set', () => {
      process.env.jsonOne = '{}';

      const output = functions.parseEnvJSON('jsonOne');

      expect(output).toEqual({});
    });

    it('should return value from process.env - undefined', () => {
      const output = functions.parseEnvJSON('jsonTwo');

      expect(output).toEqual(undefined);
    });

    it('should ignore default value is variable is defined', () => {
      process.env.jsonThree = '{"a":"b"}';

      const output = functions.parseEnvJSON('jsonThree', { defaultValue: { a: 'c' } });

      expect(output).toEqual({ a: 'b' });
    });

    it('should use default value if variable is not defined', () => {
      const output = functions.parseEnvJSON('jsonFour', { defaultValue: { a: 'c' } });

      expect(output).toEqual({ a: 'c' });
    });

    it('should use the parser function', () => {
      process.env.jsonFive = '{}';

      const output = functions.parseEnvJSON('jsonFive', (value?: object) => {
        if (!value) { return {}; }
        return {
          c: 4711,
          ...value
        };
      });

      expect(output).toMatchObject({ c: 4711 });
    });

    it('should respect StringConfig', () => { // not bothering to test much more here
      expect(() => {
        functions.parseEnvJSON('jsonSix', {
          required: true
        });
      }).toThrow();
    });
  });
});
