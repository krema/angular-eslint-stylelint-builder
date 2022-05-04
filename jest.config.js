/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['lib'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['test-project', 'out'],
  testLocationInResults: true,
  reporters: ['default'],
  setupFilesAfterEnv: ['jest-extended/all'],
};
