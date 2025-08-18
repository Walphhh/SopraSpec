module.exports = {
  preset: "ts-jest",
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
};
