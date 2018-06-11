import vehicleController from '../../controllers/test';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth } from '../../middlewares/jwtAuth';

export default app => {
  app.get('/api/tests', vehicleController.list);
  app.post('/api/tests', jwtAuth, bodyParser.json, vehicleController.create);
  app.put('/api/vehicles/:id', jwtAuth, bodyParser.json, vehicleController.update);
  app.delete('/api/vehicles/:id', jwtAuth, vehicleController.remove);
};
