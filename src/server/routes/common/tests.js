import testController from '../../controllers/test';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth } from '../../middlewares/jwtAuth';

export default app => {
  app.get('/api/tests', testController.list);
  app.get('/api/tests/:id', testController.check);
  app.post('/api/tests', jwtAuth, bodyParser.json, testController.create);
  app.put('/api/tests/:id', jwtAuth, bodyParser.json, testController.update);
  app.delete('/api/tests/:id', jwtAuth, testController.remove);
};
