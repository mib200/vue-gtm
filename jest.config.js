module.exports = {
  preset: "ts-jest",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  reporters: ["default", "jest-junit"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
};
