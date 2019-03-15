import FormNames from '../constants/FormNames';

import p from '../utils/agents';

export default {
  [FormNames.USER_REGISTER]: {
    email(req, res) {
      p.query('SELECT * FROM user WHERE email=$1', req.body.value)
        .then(user => {
          if (user) {
            res.json({
              isPassed: false,
              message: 'The email is already registered'
            });
          } else {
            res.json({
              isPassed: true
            });
          }
        })
    }
  },

  [FormNames.USER_VERIFY_EMAIL]: {
    email(req, res) {
      p.query('SELECT * FROM user WHERE email=$1', req.body.value)
        .then(user => {
          if (!user) {
            res.json({
              isPassed: false,
              message: 'This is an invalid account'
            });
          } else {
            res.json({
              isPassed: true
            });
          }
        });
    }
  },

  [FormNames.USER_FORGET_PASSWORD]: {
    email(req, res) {
      p.query('SELECT * FROM user WHERE email=$1', req.body.value)
        .then(user => {
          if (!user) {
            res.json({
              isPassed: false,
              message: 'This is an invalid account'
            });
          } else {
            res.json({
              isPassed: true
            });
          }
        });
    }
  }
};
