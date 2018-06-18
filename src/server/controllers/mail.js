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
    const {access_token, user_id, session_id, verify_email_nonce} = user;
    const token = genVerifyEmailToken(user_id, verify_email_nonce);
    console.log(token);
    nodemailerAPI()
      .sendMail({
        ...(
          process.env.NODE_ENV === 'development' ?
          { to: user.email } :
          {}
        ),
        subject: 'Email Verification',
        html: renderToString(
          <VerifyEmailMail token={token} />
        ),
      })
      .catch((err) => {
        res.errors([Errors.SEND_EMAIL_FAIL]);
        console.log(err);
        throw err;
      })
      .then(detail => {
        const info = { user_id, session_id };
        res.status(200).json({
          status: 200,
          info,
          token: access_token,
          email: detail && detail.envelope
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
