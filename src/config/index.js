/* @flow */

if (process.env.NODE_ENV) {
  console.log('hi1');
  module.exports = require('./default');
} else {
  console.log('hi2');
  module.exports = require('./prod');
}
