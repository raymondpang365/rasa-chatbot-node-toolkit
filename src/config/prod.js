/* @flow */

const merge = require('lodash/fp/merge');

const defaultConfig = require('./default');

module.exports = merge(defaultConfig, {
  host: process.env.NODE_HOST || '0.0.0.0', // Define your host from 'package.json'
  port: process.env.PORT || 8080,
  sslEnabled: process.env.SSL_ENABLED,
  passportStrategy: {
    facebook: require('./passportStrategy/facebook/credential').production,
    google: require('./passportStrategy/google/credential').production,
  },
});
