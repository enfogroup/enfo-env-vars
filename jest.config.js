module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '@clients/(.*)$': '<rootDir>/src/clients/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
    '@models/(.*)$': '<rootDir>/src/models/$1'
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
    'src/**/*.ts'
  ],
  verbose: true
};
