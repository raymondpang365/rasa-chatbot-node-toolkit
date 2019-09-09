
import mountStore from './mountStore';
import mountHelper from './mountHelper';
import passportInit from './passportInit';


export default app => {


  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
  });

  app.use(mountStore);
  app.use(mountHelper);
  app.use(passportInit);

  require('../controllers/cause/outer/index');
  require('../controllers/announcement/schedule');

};
