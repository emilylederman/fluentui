const { createConfig } = require('@fluentui/scripts/jest/jest-resources');
const config = createConfig({
  testRegex: '\\.test\\.js$',
});

module.exports = config;
