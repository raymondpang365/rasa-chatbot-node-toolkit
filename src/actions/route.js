import { push } from 'react-router-redux';
import { setCookie } from './cookie';

export const redirect = path => dispatch => {
  dispatch(setCookie('redirect', path));
  dispatch(push(path));
};

