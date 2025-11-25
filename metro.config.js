const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add proxy configuration for API calls
config.resolver = {
  ...config.resolver,
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
    },
  },
};

module.exports = config;