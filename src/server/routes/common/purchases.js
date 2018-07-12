import purchaseController from '../../controllers/purchase';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.get('/api/purchases', jwtAuth, purchaseController.list);
  app.get('/api/purchases/latest', jwtAuth, purchaseController.checkLatest);
  app.get('/api/purchases/:testcode', jwtAuthOptional, purchaseController.check);
  app.post('/api/purchases', jwtAuth, bodyParser.json, purchaseController.create);
  app.put('/api/purchases/:testcode', jwtAuth, bodyParser.json, purchaseController.bind);
  app.delete('/api/purchases/:testcode', jwtAuth, purchaseController.remove);
};
