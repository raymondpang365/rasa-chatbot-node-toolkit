import matchController from '../controllers/match';
import bodyParser from '../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../middlewares/jwtAuth';


export default app => {
  app.post('/api/match/create', jwtAuth, bodyParser.json, matchController.createMatch, matchController.saveSuggestion);
  app.get('/api/match/join/:id', jwtAuth, matchController.joinMatch);
  app.get('/api/match/check/:id', jwtAuth, matchController.check);

  app.get('/api/match/calculateMatchResult/:id', matchController.calculateMatchResult);


  /**
   * matchDetail:{
        budget: {
          min: 0,
          max: 80,
          value: [0, 80]
        },
        foodSize: {
          min: 0,
          max: 80,
          value: [0, 80]
        },
        parking: {
          goByTransport: true,
          freeParking: true
        },
        tags: []
      },
   */
  app.post('/api/matches/suggest', jwtAuth, bodyParser.json, matchController.saveSuggestion);



  app.get('/api/matches', jwtAuth, matchController.list);
  app.get('/api/match/result/:id',  matchController.matchResult);
};
