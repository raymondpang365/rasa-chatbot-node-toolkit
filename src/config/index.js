/* @flow */

if (process.env.NODE_ENV) {
  module.exports = require('./default');
} else {
  module.exports = require('./prod');
}
