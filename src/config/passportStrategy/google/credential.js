module.exports = {
  development: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${process.env.NODE_HOST}:${process.env.PUBLIC_PORT}/auth/google/callback`
  },
  production: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HAS_DOMAIN_NAME ?
      `https://${process.env.DOMAIN_NAME}/auth/facebook/callback` :
      `http://${process.env.NODE_HOST}:${process.env.PUBLIC_PORT}/auth/facebook/callback`
  }
};
