

if (process.env.NODE_ENV === "development") {

  module.exports = require('./default');
} else {

  console.log(process.env.PUBLIC_PORT);
  console.log(process.env.NODE_HOST);
  module.exports = require('./prod');
}
