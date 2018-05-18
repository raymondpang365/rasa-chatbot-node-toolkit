import cookie from 'cookie';

import deserializeCookieMap from '../helpers/deserializeCookieMap';

import { Cookie, Action } from '../types';

type State = Cookie;

let initCookies = {};

if (process.env.BROWSER) {
  initCookies = deserializeCookieMap(cookie.parse(document.cookie));
} else {
  initCookies = {};
}

export default (state: State = initCookies, action: Action) => {
  switch (action.type) {
    case 'SET_COOKIE': {
      return {
        ...state,
        [action.cookie.name]: action.cookie.value
      };
    }
    default: {
      return state;
    }
  }
};
