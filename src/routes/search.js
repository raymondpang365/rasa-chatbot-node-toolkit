import searchController from '../controllers/search';
import bodyParser from '../middlewares/bodyParser';
import { jwtAuth, jwtAuthOptional } from '../middlewares/jwtAuth';



export default app => {
  app.post('/api/search',
    bodyParser.json,
    searchController.wordFilter,
    searchController.search
  );
  app.post('/api/testsearch', bodyParser.json, searchController.testSearch);
};
