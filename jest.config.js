const aliases = [
  'app',
  'components',
  'hooks',
  'services',
  'contexts',
  'theme',
  'constants',
  'dtos',
  'models',
  'interfaces',
  'enums',
  'utils',
  'lib',
  'locales',
  'assets',
];

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.int-spec.tsx'],
  setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.ts'],
  moduleNameMapper: {
    ...Object.fromEntries(
      aliases.map((alias) => [`^@${alias}/(.*)$`, `<rootDir>/src/${alias}/$1`]),
    ),
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/app/**', '!src/**/index.ts'],
  coverageDirectory: 'coverage',
  maxWorkers: 4,
};
