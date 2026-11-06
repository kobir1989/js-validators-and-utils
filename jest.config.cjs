/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/index.ts',
    '!src/validators/phonesPattern.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 97,
      statements: 95
    }
  },
  coverageDirectory: 'coverage'
}
