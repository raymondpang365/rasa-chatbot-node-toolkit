import courseController from '../../controllers/business';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.post('/api/businesses', bodyParser.json, courseController.create);
  app.get('/api/businesses', courseController.list);
  app.get('/api/businesses/:id', jwtAuth, courseController.check);
  app.delete('/api/businesses/:testcode', jwtAuth, courseController.remove);
};
