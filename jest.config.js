module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '@parse/(.*)$': '<rootDir>/src/parse/$1',
    '@test/(.*)$': '<rootDir>/test/$1'
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/interfaces/*.ts',
    '!src/index.ts'
  ],
  verbose: true
};
