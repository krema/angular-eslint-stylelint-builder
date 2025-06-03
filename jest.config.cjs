/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['lib'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['test-project'],
  testLocationInResults: true,
  reporters: ['default'],
  setupFilesAfterEnv: ['jest-extended/all'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
};
