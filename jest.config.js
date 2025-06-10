export default {
  rootDir: 'test',
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  transform: {
    '^.+\\.(mjs|js|ts)?$': 'ts-jest',
  },
};
