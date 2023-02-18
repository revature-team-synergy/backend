module.exports = {
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',
    moduleFileExtensions: ['js'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^test/(.*)$': '<rootDir>/test/$1',
    },
  };
  