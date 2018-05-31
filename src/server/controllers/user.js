import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import jsonwebtoken from 'jsonwebtoken';
import Errors from '../../constants/Errors';
import { loginUser } from '../../actions/user';
import { redirect } from '../../actions/route';
import { jwt, nodemailer } from '../../config/index';
import { jwtExtractor, genAccessToken, genRefreshToken } from '../utils/tokenHelper'
import p from '../utils/agents';
import paginate from '../utils/paginate'

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


export default {

  emailCreate: (req, res, next) => {
    p.query('SELECT * FROM user_info where email = $1', req.body.email)
      .then(results => {
        const user = results.rows[0];
        if (user) {
          throw Errors.USER_EXISTED;
        } else {
          return p.query("INSERT INTO user_info ('name', 'email', 'password', 'verify_email_nonce') " +
            "VALUES ($1, $2, $3, $4)",
            [req.body.name, req.body.email, req.body.password, Math.random()]);
        }
      }).then( result => {
        const _user = result.rows[0];
        req.user = _user;
        if (!nodemailer) {
          return res.status(200).json({status: 200, data: _user });
        }
        return next();
      }).catch( err => {
        res.pushError(err);
        res.error();
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
        res.error();
      });
  },

  emailLogin: (req, res) => {
    p.query('SELECT * FROM user_info where email = $1', [req.body.email])
      .then(result => {
        const user = result.rows[0];
        if (!user) {
          res.status(200).json({status: 200, isAuth: false});
        }
        else if(user.password === hashPassword(req.body.password)) {
            const token = genAccessToken({
              _id: this._id,
              name: this.name,
              email: this.email
            });
            p.query("UPDATE user_info SET last_login_time = CURRENT_TIMESTAMP" +
              "WHERE user_id = $1", [user.user_id])
              .then(() => {
                res.status(200).json({status: 200, data: {isAuth: true, token, user}});
              })
              .catch(err => {
                res.pushError(err);
                res.error();
              })
        }
        else {
          res.status(200).json({status: 200, isAuth: false});
        }
    }).catch(err => {
      res.pushError(err);
      res.error();
    })
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
        res.error();
      });
  },

  socialLogin: (req, res, next) => {
    const state = JSON.parse(req.query.state);
    if(state.env === "native") {
      return res.redirect(`${appName}://login?user=${JSON.stringify(req.user)}`)
    }
    else {
      const { user } = req;
      const { token, info } = user;
      delete user.token;
      req.store.dispatch(loginUser({ token, info }, res));
      req.store.dispatch(redirect(state.next || '/'));
      return next();
    }
  },



  emailUpdatePassword: (req, res) => {
    const {user} = req;
    if(req.body === null){
      res.pushError(Errors.INVALID_DATA);
      res.error();
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
      }).catch(()=>{

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
    p.query('UPDATE session SET refresh_token = null WHERE session_id = ?',
      [req.jwtPayload.session_id]
    ).then(results => {
      if (results.affectedRows !== 1){
        throw Errors.DB_OPERATION_FAIL;
      }
      else{
        req.logout();
        res.status(200).json({status: 200, data: results});
      }
    }).catch(err => {
      res.pushError(Errors.DB_OPERATION_FAIL);
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
