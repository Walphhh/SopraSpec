module.exports = {
  preset: "ts-jest",
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "html"], // “text” prints to the CLI\
  reporters: ["default", "jest-spec-reporter"],
};
