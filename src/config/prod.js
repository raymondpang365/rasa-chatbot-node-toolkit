const merge = require('lodash/fp/merge');

const defaultConfig = require('./default');

module.exports =merge(defaultConfig,{
  listenTo: process.env.LISTEN_TO || 'localhost',
  host: process.env.NODE_HOST || '128.199.140.120', // Define your host from 'package.json'
  //port: process.env.PORT || 8080,
  port: process.env.PORT || 3001,
  publicPort: process.env.PUBLIC_PORT || 999,
  domainName: process.env.DOMAIN_NAME,
  hasDomainName: process.env.HAS_DOMAIN_NAME || true,
  passportStrategy: {
    facebook: require('./passportStrategy/facebook/credential').production,
    google: require('./passportStrategy/google/credential').production,
  },
  nodemailer:{
    service: 'gmail',
    auth: {
      user: 'your_gmail_username',
      pass: 'your_gmail_password',
    },
  }
});
