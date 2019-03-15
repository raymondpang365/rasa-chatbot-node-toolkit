import { pushErrors } from '../actions/error';

export default (req, res, next) => {
  res.pushError = (error, meta) => {
    req.store.dispatch(pushErrors([{
      ...error,
      meta: {
        path: req.path,
        ...meta,
      },
    }]));
  };

  res.softErrors = (errors) => {
    req.store.dispatch(pushErrors(errors));
    const status = req.store.getState().errors.reduce((max, error) => {
      max = ( max === undefined || error.status > max ) ? error.status : max;
      return max;
    }, []);
    res.status(200).json({
      status,
      errors: req.store.getState().errors.map((error) => {
        delete error.id;
        delete error.status;
        return {
          ...error,
          meta: {
            path: req.path,
            ...error.meta,
          },
        };
      }),
    });
  };

  res.errors = (errors) => {
    req.store.dispatch(pushErrors(errors));
    const status = req.store.getState().errors.reduce((max, error) => {
      max = ( max === undefined || error.status > max ) ? error.status : max;
      return max;
    }, []);
    res.status(status).json({
      status,
      errors: req.store.getState().errors.map((error) => {
        delete error.id;
        delete error.status;
        return {
          ...error,
          meta: {
            path: req.path,
            ...error.meta,
          },
        };
      }),
    });
  };

  next();
};
