import createHistory from 'history/createMemoryHistory';
import serverConfigureStore from '../../helpers/serverConfigureStore';

export default (req, res, next) => {
 // console.log(req.headers);
  req.history = createHistory();
  req.store = serverConfigureStore(req);
 // console.log(req.store.getState().cookies);
  next();
};
