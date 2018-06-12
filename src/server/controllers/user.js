import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import crypto from 'crypto';
import Errors from '../../constants/Errors';
import { loginUser } from '../../actions/user';
import redirect from '../../actions/route';
import { jwt, nodemailer } from '../../config/index';
import {  genAccessToken, genRefreshToken } from '../utils/tokenHelper'

import p from '../utils/agents';
import paginate from '../utils/paginate'

const uuidv4 = require('uuid/v4');

const appName = process.env.APP_NAME || "HopeMd";

const hashPassword = (rawPassword = '') => {
  let recursiveLevel = 5;
  while (recursiveLevel) {
    rawPassword = crypto
      .createHash('md5')
      .update(rawPassword)
      .digest('hex');
    recursiveLevel -= 1;
  }
  return rawPassword;
};

const randomValueHex = (len) =>
  crypto.randomBytes(Math.ceil(len/2))
    .toString('hex') // convert to hexadecimal format
    .slice(0,len).toUpperCase();   // return required number of characters


export default {

  emailRegister: (req, res, next) => {
    console.log("email register");
    p.query('SELECT * FROM user_info where email = $1', [req.body.email])
      .then(results => {
        if (results.rowCount > 0) {
          console.log("user existed");
          throw Errors.USER_EXISTED;
        } else {
          return Promise.all([hashPassword(req.body.password),randomValueHex(6)]);
        }
      }).then( results =>
         p.transaction(conn =>
          p.query("INSERT INTO user_info (display_name, email, password, verify_email_nonce) " +
            "VALUES ($1, $2, $3, $4) RETURNING id",
            [ req.body.name, req.body.email, results[0], results[1] ])
            .then(insertResult => {
              const lastId = insertResult.rows[0].id;
              const lastIdStr = `${lastId}`;
              const pad = (`U00000000`).slice(0, -lastIdStr.length);
              const session_id = uuidv4();
              const refresh_token = genRefreshToken({ session_id });
              const user_id = `${pad}${lastIdStr}`;
              return Promise.all([
                p.query(
                  "UPDATE user_info SET user_id = $1 WHERE id = $2 RETURNING user_id",
                  [user_id, lastId]),
                p.query(
                  "INSERT INTO session (user_id, session_id, refresh_token ,login_time, create_time ) " +
                  "VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) " +
                  "RETURNING session_id, refresh_token",
                  [user_id, session_id, refresh_token])
              ]);
            })
        )
    ).then( result => {
        console.log(result);
        const _user = result.rows[0];
        req.user = _user;
        if (!nodemailer) {
          return res.status(200).json({status: 200, data: _user });
        }
        return next();
      }).catch( err => {
        console.log(err);
        res.pushError(err);
        res.errors();
    })
  },

  emailLogin: (req, res) => {
    console.log("email login");
    p.query('SELECT * FROM user_info where email = $1', [req.body.email])
      .then(result => {
        if (result.rowCount === 0) {
          console("no user found");
          res.status(401).json({status: 401, isAuth: false});
        }
        else if(result.rows[0].password === hashPassword(req.body.password)) {
          const {user_id} = result.rows[0];
          const session_id = uuidv4();
          const refresh_token = genRefreshToken({session_id});
          return Promise.all([
            p.query(
              "UPDATE user_info SET last_login_time=CURRENT_TIMESTAMP WHERE user_id=$1 " +
              "RETURNING last_login_time",
              [user_id]
            ),
            p.query(
              "INSERT INTO session (user_id, session_id, refresh_token, login_time, create_time ) " +
              "VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) " +
              "RETURNING user_id, session_id",
              [user_id, session_id, refresh_token])
          ]);
        }
        else{
          console.log("wrong password");
          throw Errors.USER_UNAUTHORIZED;
        }
      }).then(results => {
        const { user_id, session_id } = results[0].rows[0];
        const access_token = genAccessToken({ user_id, session_id });
        console.log('case 2');
        const info = { user_id, session_id };
        const data = {token: access_token, info};
        res.status(200).json({status: 200, isAuth: true, ...data});
      }).catch(err => {
        console.log(err);
        res.pushError(err);
        res.errors();
      })
  },

  verifyEmail: (req, res) => {
    const { user } = req;

    user.email.isVerified = true;
    user.email.verifiedAt = new Date();
    p.query('UPDATE email SET is_verified = true, verified_at = CURRENT_TIMESTAMP ' +
      'WHERE address = $1',
      [user.email])
      .then((result) => {
        res.status(200).json({status: 200, data: result});
      })
      .catch(err => {
        res.pushError(err);
        res.errors();
      });
  },



  emailSetNonce: (nonceKey) => (req, res, next) => {

    p.query('SELECT * FROM user_info where email = $1', req.body.email)
      .then( result => {
        const user = result.rows[0];
        user.nonce[nonceKey] = Math.random();
        return p.query('UPDATE * FROM user_info where user_id = $1', user.user_id)
      })
      .then( result => {
        res.status(200).json({status: 200, data: result});
      })
      .catch( err => {
        res.pushError(err);
        res.errors();
      });
  },

  socialLogin: (req, res, next) => {
    const state = JSON.parse(req.query.state);
    if(state.env === "native") {
      return res.redirect(`${appName}://login?user=${JSON.stringify(req.user)}`)
    }
    else {
      console.log(req);
      const { user } = req;
      const { token, info } = user;
      delete user.token;
      console.log('super bibibo');
      req.store.dispatch(loginUser({ token, info }, res));
      res.redirect(state.next || '/');
      console.log('ultimate bibibo');
      return next();
    }
  },



  emailUpdatePassword: (req, res) => {
    const {user} = req;
    if(req.body === null){
      res.pushError(Errors.INVALID_DATA);
      res.errors();
    }
    p.query('SELECT user_password FROM user_info WHERE user_id', user.user_id)
      .then(result => {
        const pw = result.rows[0];
        if (pw === hashPassword(req.body.oldPassword)) {
          return p.query('UPDATE user_info SET user_password = $1', req.body.newPassword);
        }
        else {
          res.json({
            isAuth: false
          });
        }
      }).then(result => {
      res.status(200).json({
        status: 200,
        data: { originAttributes: req.body, isAuth: true, user: result }
      });
    }).catch(err => {

    });
  },

  emailResetPassword: (req, res) => {
    const { user } = req;
    p.query('UPDATE user_info SET password = $1 WHERE user_id = $2',
      [req.body.newPassword, user.user_id])
      .then(result => {
        const _user = result.rows[0];
        res.json({
          originAttributes: req.body,
          user: _user
        });
      }).catch(err=>{
        res.pushError(err);
        res.errors();
      });
  },

  list(req, res) {

    p.query('SELECT * FROM user_info').then(
      _tests => {
        if("page" in req.query && "limit" in req.query) {
          _tests = paginate(_tests, req.query.page, req.query.limit);
        }
        res.json({
          tests: _tests
        });
      });
  },

  logout(req, res) {
    console.log(res.locals.decoded);
    p.query('DELETE FROM session WHERE session_id = $1',
      [res.locals.decoded.session_id]
    ).then(results => {
      req.logout();
      res.status(200).json({status: 200, data: results});
    }).catch(err => {
      res.pushError(err);
      res.errors();
    });
  },

  readSelf(req, res) {
    res.json({
      user: req.user
    });
  },

  registerDevice(req, res) {
    const { uuid, device_token } = req.body;
    p.query("UPDATE user_info SET uuid = $1, device_token = $2 WHERE user_id = $3",
      [uuid, device_token, req.user.user_id])
      .then(
        res.json({ status: 200, data: { uuid, device_token } })
      ).catch(err => {
      res.pushError(err);
      res.errors();
    });
  },

  update(req, res) {
    const { user } = req;
    p.query("UPDATE user_info SET $1", [user])
      .then(_user => {
        res.json({
          originAttributes: req.body,
          user: _user
        });
      });
  },

  updateAvatarURL(req, res) {
    const { url } = req;
    p.query("UPDATE TABLE user_info SET avatar_url = $1", [url])
      .then(
        res.json({ status: 200, data: url })
      ).catch(err => {
      res.pushError(err);
      res.errors();
    });
  },

  uploadAvatar(req, res) {
    // use `req.file` to access the avatar file
    // and use `req.body` to access other fileds
    const { filename } = req.files.avatar[0];
    const tmpPath = req.files.avatar[0].path;
    const targetDir = path.join(
      __dirname,
      '../../public',
      'users',
      req.user._id.toString()
    );
    const targetPath = path.join(targetDir, filename);

    mkdirp(
      targetDir,
      fs.rename(
        tmpPath,
        targetPath,
        () => {
          res.json({
            downloadURL: `/users/${req.user._id}/${filename}`
          });
        }
      )
    );
  }
};
