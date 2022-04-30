/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['lib'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['test-project', 'out'],
  testLocationInResults: true,
  reporters: ['default', 'jest-junit', 'jest-github-actions-reporter'],
  setupFilesAfterEnv: ['jest-extended/all']
};
