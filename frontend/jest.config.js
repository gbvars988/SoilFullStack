module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|ttf|woff|woff2)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(axios)/)"],
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(test).js?(x)"],
};
