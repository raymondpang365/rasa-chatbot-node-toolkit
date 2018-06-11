import cookie from 'cookie';
import assign from 'object-assign';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import { deserializeCookie } from '../helpers/deserializeCookieMap';

export const setCookie = (name, value, options, res = null) => {
  options = assign(
    {
      path: '/'
    },
    options
  );
  const deserializedValue = deserializeCookie(value);

  return dispatch => {
    let serializedValue;

    if (isString(value)) {
      serializedValue = value;
    } else if (isObject(value)) {
      serializedValue = JSON.stringify(value);
    }

    if (typeof window !== "undefined") {
      document.cookie = cookie.serialize(name, serializedValue, options);
    } else if (res) {
      res.cookie(name, serializedValue);
    }
    console.log('hehe');
    console.log(name);
    console.log(serializedValue);
    console.log('hehe');
    dispatch({
      type: 'SET_COOKIE',
      cookie: {
        name,
        value: deserializedValue,
        options
      }
    });
  };
};

export const setCookies = (cookies, res = null) => dispatch => {
  Object.keys(cookies).forEach(name =>
    dispatch(setCookie(name, cookies[name], {}, res))

  );
};

export const removeCookie = name => dispatch => {
  if (typeof window !== "undefined") {
    console.log(`done remove cookie ${name}`);
    return dispatch(
      setCookie(name, '', {
        expires: new Date(1970, 1, 1, 0, 0, 1)
      })
    );
  }
  return Promise.resolve();
};
