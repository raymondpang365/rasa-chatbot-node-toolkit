import cookie from 'cookie';
import { setCookies } from '../../actions/cookie';

export default (req, res, next) => {
  console.log("req.headers.cookie");
  console.log(req.headers.cookie);
  if (req.headers.cookie !== undefined) {
    const c = cookie.parse(req.headers.cookie);
    req.store.dispatch(setCookies(c));
  }
  next();
};
