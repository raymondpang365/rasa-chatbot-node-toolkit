import testController from '../../controllers/test';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuthRequired } from '../../middlewares/jwtAuth';

export default app => {
  app.get('/api/tests', testController.list);
  app.get('/api/tests/:id', testController.check);
  app.post('/api/tests', jwtAuthRequired, bodyParser.json, testController.create);
  app.put('/api/tests/:id', jwtAuthRequired, bodyParser.json, testController.update);
  app.delete('/api/tests/:id', jwtAuthRequired, testController.remove);
};
