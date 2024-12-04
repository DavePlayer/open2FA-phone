// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Yeah, not working :|
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   if (moduleName === 'crypto') {
//     // when importing crypto, resolve to react-native-quick-crypto
//     return context.resolveRequest(
//       context,
//       'react-native-quick-crypto',
//       platform,
//     )
//   }
//   // otherwise chain to the standard Metro resolver.
//   return context.resolveRequest(context, moduleName, platform)
// }

config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  events: require.resolve('events'),
  crypto: require.resolve('react-native-quick-crypto'),
  QuickCrypto: require.resolve('react-native-quick-crypto')
};


module.exports = withNativeWind(config, { input: "./assets/styles.css" });