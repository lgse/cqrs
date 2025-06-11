export default {
  collectCoverageFrom: ['<rootDir>/src/**'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text', 'clover'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  transform: {
    '^.+\\.(mjs|js|ts)?$': 'ts-jest',
  },
};
