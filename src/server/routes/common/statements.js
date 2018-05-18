import statementController from '../../controllers/test';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuthRequired } from '../../middlewares/jwtAuth';

export default app => {
  app.get('/api/tests', statementController.list);
  app.post('/api/tests', jwtAuthRequired, bodyParser.json, statementController.create);
  app.put('/api/statements/:id', jwtAuthRequired, bodyParser.json, statementController.update);
  app.delete('/api/statements/:id', jwtAuthRequired, statementController.remove);
};
