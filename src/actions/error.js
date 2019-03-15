import Errors from '../constants/Errors';

export const pushError = (error, meta) => ({
  type: 'PUSH_ERRORS',
  errors: [
    {
      ...error,
      meta
    }
  ]
});

export const pushErrors = errors => {
  if (errors && errors.length === undefined) {
    return pushError(Errors.UNKNOWN_EXCEPTION, errors);
  }
  return {
    type: 'PUSH_ERRORS',
    errors
  };
};

export const removeError = id => ({
  type: 'REMOVE_ERROR',
  id
});
