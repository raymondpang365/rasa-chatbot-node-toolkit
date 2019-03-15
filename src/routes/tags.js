import tagController from '../controllers/tag';
import bodyParser from '../middlewares/bodyParser';

export default app => {
  app.get('/api/tags', tagController.list);
  app.post('/api/tags', bodyParser.json, tagController.create);
  app.delete('/api/tags/:id', tagController.remove);
};
