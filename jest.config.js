module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^./modules/(.*)$': '<rootDir>/js/modules/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'js/modules/*.js',
    'js/main.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
};
