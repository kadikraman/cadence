// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactNative = require('eslint-plugin-react-native');

module.exports = defineConfig(globalIgnores(['dist/*']), [
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'react-native': reactNative,
    },
    rules: {
      'react-native/no-unused-styles': 2,
    },
  },
]);
