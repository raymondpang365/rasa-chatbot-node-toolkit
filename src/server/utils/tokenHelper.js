import jsonwebtoken from 'jsonwebtoken';
import { jwt } from '../../config/index';

module.exports = {
  jwtExtractor: req => (req.query.env === "native") ?
    ((req.headers.authorization)?
        req.headers.authorization.match(/Bearer ([^#]+)/)[1]
        : null
    )
    : req.store.getState().cookies.token,

  genAccessToken: data =>
  jsonwebtoken.sign(JSON.parse(JSON.stringify(data)), jwt.accessToken.secret, {
    expiresIn: jwt.accessToken.expiresIn
  }),

  genRefreshToken: data =>
  jsonwebtoken.sign(JSON.parse(JSON.stringify(data)), jwt.refreshToken.secret, {
    expiresIn: jwt.refreshToken.expiresIn
  }),

  genVerifyEmailToken: (id, verifyEmailNonce) => {
    const user = {
      _id: id,
      nonce: verifyEmailNonce,
    };
    const token = jwt.sign(user, jwt.verifyEmail.secret, {
      expiresIn: jwt.verifyEmail.expiresIn,
    });
    return token;
  },

  genResetPasswordToken: (id, resetPasswordNonce) => {
    const user = {
      _id: id,
      nonce: resetPasswordNonce,
    };
    const token = jwt.sign(user, jwt.resetPassword.secret, {
      expiresIn: jwt.resetPassword.expiresIn,
    });
    return token;
  }
}
