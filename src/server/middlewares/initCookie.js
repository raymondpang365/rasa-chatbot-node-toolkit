import cookie from 'cookie';
import { setCookies } from '../../actions/cookie';

export default (req, res, next) => {
  if (req.headers.cookie !== undefined) {
    const c = cookie.parse(req.headers.cookie);
    req.store.dispatch(setCookies(c));
  }
  next();
};
