/**
 * Created by raymond on 5/27/17.
 */
import passport from 'passport';

export default {
  setupError: (req, res) => {
    res.send(
      'Please setup and turn on `passportStrategy.&lt;social provider&gt;` ' +
        'of config file `configs/project/server.js`'
    );
  },
  initFacebook: (req, res, next) =>
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email'],
      state: JSON.stringify(
        {
          next: req.query.next,
          env: req.query.env
        })
    })(req, res, next),
  initGoogle: (req, res, next) =>
    passport.authenticate('google', {
      scope: ['profile'],
      state: JSON.stringify({
        next: req.query.next,
        env: req.query.env
      })
    })(req, res, next)
};
