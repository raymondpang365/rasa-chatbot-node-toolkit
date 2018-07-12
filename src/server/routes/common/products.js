import productController from '../../controllers/product';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth } from '../../middlewares/jwtAuth';

export default app => {
  app.get('/api/products', productController.list);
  app.get('/api/products/:id', productController.check);
  app.post('/api/products', jwtAuth, bodyParser.json, productController.create);
  app.put('/api/products/:id', jwtAuth, bodyParser.json, productController.update);
  app.delete('/api/products/:id', jwtAuth, productController.remove);
};
