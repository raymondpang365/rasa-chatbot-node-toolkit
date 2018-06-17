import React from 'react';
import { renderToString } from 'react-dom/server';
import Errors from '../../constants/Errors';
import nodemailerAPI from '../api/nodemailer';
import VerifyEmailMail from '../components/VerifyEmailMail';
import ResetPasswordMail from '../components/ResetPasswordMail';
import { jwt }  from '../../config'
import { genVerifyEmailToken, genResetPasswordToken } from '../utils/tokenHelper';

export default {
  sendVerification(req, res) {
    console.log('send verification');
    const { user } = req;
    console.log(user);
    const {userId, verifyEmailNonce} = user;
    const token = genVerifyEmailToken(userId, verifyEmailNonce);
    console.log(token);
    nodemailerAPI()
      .sendMail({
        ...(
          process.env.NODE_ENV === 'development' ?
          { to: user.email.value } :
          {}
        ),
        subject: 'Email Verification',
        html: renderToString(
          <VerifyEmailMail token={token} />
        ),
      })
      .catch((err) => {
        res.errors([Errors.SEND_EMAIL_FAIL]);
        throw err;
      })
      .then((info) => {
        res.json({
          user,
          email: info && info.envelope,
        });
      });
  },

  sendResetPasswordLink(req, res) {
    const { user } = req;
    const { userId, resetPasswordNonce } = user;
    const token = genResetPasswordToken(userId, resetPasswordNonce);

    nodemailerAPI()
      .sendMail({
        ...(
          process.env.NODE_ENV === 'production' ?
          { to: user.email.value } :
          {}
        ),
        subject: 'Reset Password Request',
        html: renderToString(
          <ResetPasswordMail
            requestedAt={new Date()}
            token={token}
          />
        ),
      })
      .catch((err) => {
        res.errors([Errors.SEND_EMAIL_FAIL]);
        throw err;
      })
      .then((info) => {
        res.json({
          email: info.envelope,
        });
      });
  },
};
