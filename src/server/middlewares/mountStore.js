import createHistory from 'history/createMemoryHistory';
import configureStore from '../../helpers/configureStore';

export default (req, res, next) => {
  req.history = createHistory();
  req.store = configureStore(req.history);
  next();
};
