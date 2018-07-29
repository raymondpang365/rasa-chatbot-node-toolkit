import storyController from '../../controllers/story';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.post('/api/stories', jwtAuth, bodyParser.json, storyController.create);
  app.get('/api/stories', storyController.list);
  app.get('/api/stories/:id', jwtAuth, storyController.check);
  app.delete('/api/stories/:testcode', jwtAuth, storyController.remove);
};
