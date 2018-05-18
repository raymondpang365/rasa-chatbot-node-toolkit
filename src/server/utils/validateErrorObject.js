import isString from 'lodash/isString';

/**
 * @returns {boolean} isPassed
 */
const validateErrorObject = nestedErrors => {
  if (isString(nestedErrors)) {
    return false;
  }
  const keys = Object.keys(nestedErrors);
  if (keys.length === 0) {
    return true;
  }
  const isAllPass = keys.every(key => {
    const nestedError = nestedErrors[key];
    const isPass = validateErrorObject(nestedError);
    return isPass;
  });
  return isAllPass;
};

export default validateErrorObject;
