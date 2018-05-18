import passport from 'passport';
import passportAuth from '../../middlewares/passportAuth';
import { passportStrategy } from '../../../config';
import socialAuthController from '../../controllers/socialAuthRequired';
import userController from '../../controllers/user';

export default app => {

  if (passportStrategy.facebook) {
    app.get('/auth/facebook', socialAuthController.initFacebook);
    app.get('/auth/facebook/callback',
      passportAuth('facebook'),
      userController.socialLogin
    );
  } else {
    app.get('/auth/facebook', socialAuthController.setupError);
  }

  if (passportStrategy.google) {
    app.get('/auth/google', socialAuthController.initGoogle);
    app.get('/auth/google/callback',
      passport.authenticate(
        'google',
        {failureRedirect: '/auth/google'}),
      (req, res) => res.redirect(`OAuthLogin://login?user=${JSON.stringify(req.user)}`)
    );
  } else {
    app.get('/auth/google', socialAuthController.setupError);
  }
};
