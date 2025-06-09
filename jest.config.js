export default {
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  transform: {
    '^.+\\.(mjs|js|ts)?$': ['@lgse/esbuild-jest', { sourcemap: true }],
  },
};
