import passport from 'passport';
import Errors from '../../constants/Errors';

export const jwtAuthRequired = (req, res, next) => {
  passport.authenticate(
    'jwt',
    {session: false},
    (err, user, jwtPayload) => {
      [user] = user;
      if (err || user === false || user.length === 0) {
        res.pushError(Errors.USER_UNAUTHORIZED);
        return res.errors();
      }
      else if(`${new Date(jwtPayload.loginTime)}` === `${user.login_time}`){
        req.user = user;
        return next();
      }
      else{
        res.pushError(Errors.USER_UNAUTHORIZED);
        return res.errors();
      }
    })(req, res, next)
};

export const jwtAuthOptional = (req, res, next) => {
  passport.authenticate(
    'jwt',
    {session: false},
    (err, user, jwtPayload) => {
      if (err || user === false || user.length === 0) {
        return next();
      }
      else if (`${new Date(jwtPayload.loginTime)}` === `${user.login_time}`){
        req.user = user;
        return next();
      }
      else{
        res.pushError(Errors.USER_UNAUTHORIZED);
        return res.errors();
      }
    })(req, res, next);
};




