import storyController from '../controllers/story';
import bodyParser from '../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../middlewares/jwtAuth';



export default app => {
  app.post('/api/stories', jwtAuth, bodyParser.json, storyController.create);
  app.get('/api/stories', storyController.list);
  app.get('/api/stories/:id', storyController.check);
  app.delete('/api/stories/:id', jwtAuth, storyController.remove);
};
