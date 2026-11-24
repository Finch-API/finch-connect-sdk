module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.ts?$': [
      '@swc/jest',
      { jsc: { target: 'es2018', parser: { syntax: 'typescript' } } },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'index-with-react.ts',
    'react.ts',
    'umd.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};