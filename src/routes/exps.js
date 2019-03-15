import expController from '../controllers/exp';
import bodyParser from '../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../middlewares/jwtAuth';



export default app => {
  app.get('/api/exps', jwtAuth, expController.list);
  app.get('/api/exps/latest', jwtAuth, expController.checkLatest);
  app.get('/api/exps/:testcode', jwtAuthOptional, expController.check);
  app.post('/api/exps', jwtAuth, bodyParser.json, expController.create);
  app.put('/api/exps/:testcode', jwtAuth, bodyParser.json, expController.bind);
  app.delete('/api/exps/:testcode', jwtAuth, expController.remove);
};
