const merge = require('lodash/fp/merge');

const defaultConfig = require('./default');

module.exports =merge(defaultConfig,{
  listenTo: process.env.LISTEN_TO || 'localhost',
  host: process.env.NODE_HOST || '128.199.140.120', // Define your host from 'package.json'
  bot: process.env.PRO_BOT,
  isSplitNlpServer: false,
  naiveVoteClassification: false,
  port: process.env.PRO_PORT,
  publicPort: process.env.PRO_PORT,
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
