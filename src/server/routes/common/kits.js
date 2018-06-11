import kitController from '../../controllers/kit';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.get('/api/kits', jwtAuth, kitController.list);
  app.get('/api/kits/latest', jwtAuth, kitController.checkLatest);
  app.get('/api/kits/:testcode', jwtAuthOptional, kitController.check);
  app.post('/api/kits', jwtAuth, bodyParser.json, kitController.create);
  app.put('/api/kits/:testcode', jwtAuth, bodyParser.json, kitController.bind);
  app.delete('/api/kits/:testcode', jwtAuth, kitController.remove);
};
