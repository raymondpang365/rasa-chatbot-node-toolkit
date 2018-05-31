import jsonwebtoken from 'jsonwebtoken';
import p from '../utils/agents'
import {jwt} from '../../config/index'
import { jwtExtractor, genAccessToken } from '../utils/tokenHelper'
import Errors from '../../constants/Errors';

export const refreshAccessToken = (req, res, next) => {

  p.query('SELECT refresh_token FROM session WHERE session_id = $1',
    [res.locals.jwtPayload.session_id])
    .then(results => {
      const {refresh_token} = results.rows[0];
      jsonwebtoken.verify(
        refresh_token,
        jwt.refreshToken.secret,
        (err, decoded) => {
          if (err){
            res.pushError(err);
            res.pushError(Errors.USER_UNAUTHORIZED);
            res.error();
          }
          const { user_id, session_id } = decoded;

          const accessToken = genAccessToken({user_id, session_id});

          const info = {user_id, session_id};
          if (next) {
            res.send({status: 200, data: {token: accessToken, info}});
            next();
          }else {
            res.status(200).json({status: 200, data: {token: accessToken, info}});
          }
        }
      )
    }).catch(queryErr => {
      res.pushError(queryErr);
      res.error();
  });
};

export const jwtAuth = type => (req, res, next) => {

  if (type === null) type = "required";

  jsonwebtoken.verify(
    jwtExtractor(req),
    jwt.accessToken.secret,
    (err, decoded) => {
      if (err) {
        return (type === "optional") ?
          next() :
          () => {
            res.pushError(err);
            res.pushError(Errors.USER_UNAUTHORIZED);
            res.error();
          }
      }
      else if (jwt.exp < Date.now() / 1000) {
        res.locals.decoded = decoded;
        return refreshAccessToken(res, req, next);
      }
      else {
        p.query(
          "SELECT * FROM user_info WHERE user_id= $1",
          [decoded.userId]
        ).then(results => {
          if (results.rows.length() === 0) {
            res.pushError(Errors.USER_UNAUTHORIZED);
            res.error();
          }
          else {
            const user = results.rows[0];
            req.user = user;
            return next();
          }
        }).catch(queryErr => {
          res.pushError(queryErr);
          res.error();
        });
      }
    }
  )
};

