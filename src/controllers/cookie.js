import assign from 'object-assign';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';

export const setCookie = (name, value, options, res = null) => {
  options = assign(
    {
      path: '/'
    },
    options
  );

  let serializedValue;

  if (isString(value)) {
    serializedValue = value;
  } else if (isObject(value)) {
    serializedValue = JSON.stringify(value);
  }

  res.cookie(name, serializedValue);

};
