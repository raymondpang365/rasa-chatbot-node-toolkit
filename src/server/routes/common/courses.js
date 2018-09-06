import courseController from '../../controllers/course';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.post('/api/courses', jwtAuth, bodyParser.json, courseController.create);
  app.get('/api/courses', courseController.list);
  app.get('/api/courses/:id', jwtAuth, courseController.check);
  app.delete('/api/courses/:testcode', jwtAuth, courseController.remove);
};
