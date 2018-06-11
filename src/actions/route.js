import { push } from 'connected-react-router';
import { setCookie } from './cookie';

const redirect = path => dispatch => {
  dispatch(setCookie('redirect', path));
  dispatch(push(path));
};

export default redirect;

