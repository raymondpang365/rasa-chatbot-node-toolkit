import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import assign from 'object-assign';
import configs from '../../config';
import Errors from '../../constants/Errors';
import { loginUser } from '../../actions/user';
import { redirect } from '../../actions/route';
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
        const user = results.rows;
        if (user) {
          res.errors([Errors.USER_EXISTED]);
        } else {
          const newUser = {
            name: req.body.name,
            email: {
              value: req.body.email
            },
            password: req.body.password,
            nonce: {
              verifyEmail: Math.random()
            }
          };

          return p.query('INSERT INTO user_info SET $1', newUser);
        }
      }).then( _user => {
      req.user = _user;
      if (!configs.nodemailer) {
        return res.json({ _user });
      }
      return next();
      })
  },

  verifyEmail: (req, res) => {
    const { user } = req;

    user.email.isVerified = true;
    user.email.verifiedAt = new Date();
    p.query('UPDATE user_info SET $1', user)
      .then((results) => {
        res.json(results.rows);
      }
    );
  },

  emailLogin: (req, res) => {
    p.query('SELECT * FROM user_info where email = $1', req.body.email)
      .then(user => {
        if (!user) {
          res.json({
            isAuth: false
          });
        } else {
          user.auth(
            req.body.password,
            isAuth => {
              if (isAuth) {
                const token = user.toAuthenticationToken();
                user.lastLoggedInAt = new Date();
                user.save(
                  _user => {
                    res.json({
                      isAuth: true,
                      token,
                      _user
                    });
                  }
                );
              } else {
                res.json({
                  isAuth: false
                });
              }
            });
        }
      })
  },

  emailSetNonce: (nonceKey) => (req, res, next) => {

    p.query('SELECT * FROM user_info where email = $1', req.body.email)
      .then( user => {
        user.nonce[nonceKey] = Math.random();
        return p.query('UPDATE * FROM user_info where user_id = $1', user.user_id)
      });
  },

  socialLogin: (req, res, next) => {
    const state = JSON.parse(req.query.state);
    if(state.env === "native") {
      return res.redirect(`${appName}://login?user=${JSON.stringify(req.user)}`)
    }
    else {
      const {user} = req;
      if (!user) {
        return next();
      }
      const token = user.toAuthenticationToken();

      user.lastLoggedInAt = new Date();
      user.save(()=> {
          console.log(token);
          console.log(user);

          req.store.dispatch(loginUser({token, user}, res));
          req.store.dispatch(redirect(state.next || '/'));

          return next();
        }

      );
    }
  },



  emailUpdatePassword: (req, res) => {
    const {user} = req;

    p.query('SELECT user_password FROM user_info WHERE user_id', user.user_id)
      .then(pw => {
        if (pw === hashPassword(req.body.oldPassword)) {
          return p.query('UPDATE user_info SET user_password = $1', req.body.newPassword);
        }
        else {
          res.json({
            isAuth: false
          });
        }
      }).then(result => {
      res.json({
        originAttributes: req.body,
        isAuth: true,
        user: result
      });
    }).catch(err => {

    });
  },

  emailResetPassword: (req, res) => {
    const { user } = req;
    p.query('UPDATE user_info SET user_password = $1', req.body.newPassword)
      .then(_user => {
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
    req.logout();
    res.json({});
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
      res.pushError(Errors.ODM_OPERATION_FAIL);
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
      res.pushError(Errors.ODM_OPERATION_FAIL);
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
