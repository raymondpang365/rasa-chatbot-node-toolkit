import businessController from '../controllers/business';
import bodyParser from '../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../middlewares/jwtAuth';



export default app => {
  app.post('/api/businesses', bodyParser.json, businessController.create);
  app.get('/api/businesses', businessController.list);
  app.get('/api/businesses/:id', businessController.check);
  app.delete('/api/businesses/:id', jwtAuth, businessController.remove);
};
