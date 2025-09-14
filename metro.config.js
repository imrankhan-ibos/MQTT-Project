const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
};

module.exports = config;