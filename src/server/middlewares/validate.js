import axios from 'axios';
import Errors from '../../constants/Errors';
import configs from '../../config';
import validateErrorObject from '../utils/validateErrorObject';
import p from '../utils/agents';

export default {
  form: (formPath, onlyFields = []) => (req, res, next) => {
    const { validate } = require(`../../common/components/forms/${formPath}`);
    let errors = validate({
      ...req.body,
      ...req.files
    });

    if (onlyFields.length > 0) {
      const newErrors = {};
      onlyFields.forEach(field => {
        newErrors[field] = errors[field];
      });
      errors = newErrors;
    }

    if (!validateErrorObject(errors)) {
      res.pushError(Errors.INVALID_DATA, {
        errors
      });
      return res.errors();
    }
    return next();
  },

  verifyUserNonce: nonceKey => async (req, res, next) => {
    const { _id, nonce } = req.decodedPayload;
    console.log(_id);
    console.log(nonce);
    const user = await p.query('SELECT * FROM user_info WHERE user_id = $1', [_id]);
    if (nonce !== user[nonceKey]) {
      return res.errors([Errors.TOKEN_REUSED]);
    }
    user[nonceKey] = -1;
    console.log('hiki haki');
    req.user = user;
    return next();
  },

  recaptcha(req, res, next) {
    if (process.env.NODE_ENV === 'test' || !configs.recaptcha) {
      return next();
    }
    axios
      .post('https://www.google.com/recaptcha/api/siteverify')
      .type('form')
      .send({
        secret: configs.recaptcha[process.env.NODE_ENV].secretKey,
        response: req.body.recaptcha
      })
      .end((err, { body } = {}) => {
        if (err) {
          res.pushError(Errors.UNKNOWN_EXCEPTION, {
            meta: err
          });
          return res.errors();
        }
        if (!body.success) {
          res.pushError(Errors.INVALID_RECAPTCHA, {
            meta: body['error-codes']
          });
          return res.errors();
        }
        return next();
      });
    return next();
  }
};
