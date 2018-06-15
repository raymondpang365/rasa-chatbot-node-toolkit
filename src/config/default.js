/* @flow */

module.exports = {
  listenTo: process.env.LISTEN_TO || 'localhost',
  host: process.env.NODE_HOST || 'hahahost', // Define your host from 'package.json'
  port: process.env.PORT || 3000,
  publicPort: process.env.PORT || 999,
  sslEnabled: false,
  app: {
    htmlAttributes: { lang: 'en' },
    title: 'Test',
    titleTemplate: 'Test - %s',
    meta: [
      {
        name: 'description',
        content: 'The best react universal starter boilerplate in the world.'
      }
    ],
    links: [
      'https://fonts.googleapis.com/css?family=Tangerine',
      '/css/main.css'
    ]
  },
  fileUpload: {
    avatar: {
      maxSize: 1024 * 1024, // in bytes
      // MIME type
      validMIMETypes: ['image/jpeg', 'image/png', 'image/gif']
    }
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: 60 // in seconds
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: 60 * 60 * 24 * 180 // in seconds
    },
    verifyEmail: {
      secret: 'df5s6sdHdjJdRg56',
      expiresIn: 60 * 60 // in seconds
    },
    resetPassword: {
      secret: 'FsgWqLhX0Z6JvJfPYwPZ',
      expiresIn: 60 * 60 // in seconds
    }
  },
  passportStrategy: {
    facebook: require('./passportStrategy/facebook/credential').development,
    google: require('./passportStrategy/google/credential').development,
  },
  fcmServerKey: process.env.FCM_SERVER_KEY,
  recaptcha: process.env.RECAPTCHA_KEY
};
