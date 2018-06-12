module.exports = {
  development: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `http://${process.env.NODE_HOST}:3000/auth/facebook/callback`
  },
  production: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:
      `http://${process.env.NODE_HOST}:8080/auth/facebook/callback`
  }
};
