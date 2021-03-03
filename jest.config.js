module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/tests/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  testPathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/constants', '<rootDir>/tests'],
  coveragePathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/constants', '<rootDir>/tests'],
};
