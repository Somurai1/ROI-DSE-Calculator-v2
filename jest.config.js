export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/main.jsx',
    '!src/App.jsx'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
