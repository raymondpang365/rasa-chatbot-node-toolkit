import requestController from '../../controllers/request';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.post('/api/requests', jwtAuth, bodyParser.json, requestController.create);
  app.get('/api/requests', requestController.list);
  app.get('/api/requests/:id', jwtAuth, requestController.check);
  app.delete('/api/requests/:testcode', jwtAuth, requestController.remove);
};
