import matchController from '../../controllers/match';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../../middlewares/jwtAuth';



export default app => {
  app.get('/api/match/create', jwtAuth, matchController.createMatch);
  app.get('/api/matches', matchController.list);
  app.get('/api/match/result/:id', matchController.matchResult);
  app.get('/api/match/join/:id', jwtAuth, matchController.joinMatch);
};
