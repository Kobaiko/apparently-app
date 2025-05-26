const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Improve resolver for React Native compatibility
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config; 