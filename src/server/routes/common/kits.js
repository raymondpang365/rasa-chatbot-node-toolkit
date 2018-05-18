import kitController from '../../controllers/kit';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuthRequired, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.get('/api/kits', jwtAuthRequired, kitController.list);
  app.get('/api/kits/latest', jwtAuthRequired, kitController.checkLatest);
  app.get('/api/kits/:testcode', jwtAuthOptional, kitController.check);
  app.post('/api/kits', jwtAuthRequired, bodyParser.json, kitController.create);
  app.put('/api/kits/:testcode', jwtAuthRequired, bodyParser.json, kitController.bind);
  app.delete('/api/kits/:testcode', jwtAuthRequired, kitController.remove);
};
