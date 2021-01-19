module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  reporters: ["default", "jest-junit"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
};
