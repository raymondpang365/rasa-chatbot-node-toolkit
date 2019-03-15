import React from 'react';
import  ReactDOMServer from 'react-dom/server';
import Errors from '../constants/Errors';
import nodemailerAPI from '../api/nodemailer';
import VerifyEmailMail from '../components/Mail/VerifyEmailMail';
import ResetPasswordMail from '../components/Mail/ResetPasswordMail';
import { jwt }  from '../config'
import { genVerifyEmailToken, genResetPasswordToken } from '../utils/tokenHelper';
const createEmail = require('../utils/createMail');

export default {
  /*
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
  },*/

  sendTestMail(req, res){
    const sgMail = require('@sendgrid/mail');

    console.log(process.env.SENDGRID_API_KEY);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const data = {
      name: 'Alberto',
      title: 'Demo email',
    };


   // let sgMailResponse;

    createEmail(data).then(html => {
      const msg = {
        to: 'psfr937@gmail.com',
        from: 'psfr937@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html
      };

      console.log('passed');

      return sgMail.send(msg);
    }).then((result) => {
      res.status(200).json({
        status: 200,

        result
      });
    }).catch(err=>{
      console.log(err);
      res.status(400).json(err);
    })

  },

  purchaseNoticeMail(req, res) {
    const {user} = req;
    const {access_token, user_id, session_id, verify_email_nonce} = user;
    const token = genVerifyEmailToken(user_id, verify_email_nonce);
    const info = { user_id, session_id };

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const component = (token) => VerifyEmailMail(token);

    createEmail(component).then(html => {
      const msg = {
        to: 'psfr937@gmail.com',
        from: 'psfr937@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html
      };

      console.log('passed');

      return sgMail.send(msg);
    }).then((result) => {
      res.status(200).json({
        status: 200,
        token: access_token,
        info,
        result
      });
    }).catch(err=>{
      console.log(err);
      res.status(400).json(err);
    });

  },


  sendVerification(req, res) {
    const {user} = req;
    const {access_token, user_id, session_id, verify_email_nonce} = user;
    const token = genVerifyEmailToken(user_id, verify_email_nonce);
    const info = { user_id, session_id };

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const component = (token) => VerifyEmailMail(token);

    createEmail(component).then(html => {
      const msg = {
        to: 'psfr937@gmail.com',
        from: 'psfr937@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html
      };

      console.log('passed');

      return sgMail.send(msg);
    }).then((result) => {
      res.status(200).json({
        status: 200,
        token: access_token,
        info,
        result
      });
    }).catch(err=>{
      console.log(err);
      res.status(400).json(err);
    });

  },



  sendResetPasswordLink(req, res) {
    const { user } = req;
    const { userId, resetPasswordNonce } = user;
    const token = genResetPasswordToken(userId, resetPasswordNonce);

    const now = new Date();

    const resetPasswordMail = (now, token) => <ResetPasswordMail
      requestedAt={now}
      token={token}
    />;

    nodemailerAPI()
      .sendMail({
        ...(
          process.env.NODE_ENV === 'production' ?
          { to: user.email.value } :
          {}
        ),
        subject: 'Reset Password Request',
        html: renderToString(
          resetPasswordMail
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
