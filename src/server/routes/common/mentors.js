import mentorController from '../../controllers/mentor';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.post('/api/mentors', jwtAuth, bodyParser.json, mentorController.create);
  app.get('/api/mentors', mentorController.list);
  app.get('/api/mentors/:id', jwtAuth, mentorController.check);
  app.delete('/api/mentors/:testcode', jwtAuth, mentorController.remove);
};
