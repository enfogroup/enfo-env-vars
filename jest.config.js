module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
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
