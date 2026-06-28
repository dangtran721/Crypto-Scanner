/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  roots: ['<rootDir>/src', '<rootDir>/test'],

  moduleNameMapper: {
    //import ... from 'src/...'
    '^src/(.*)$': '<rootDir>/src/$1',

    // import ... from '~/(.*)'
    '^~/(.*)$': '<rootDir>/src/$1',
  },

  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/prisma/seed.ts',
  ],
  coverageDirectory: './coverage',
};
