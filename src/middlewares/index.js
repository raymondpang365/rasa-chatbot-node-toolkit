import morgan from 'morgan';
import mountStore from './mountStore';
import mountHelper from './mountHelper';
import passportInit from './passportInit';

export default app => {
  // Use helmet to secure Express with various HTTP headers
  // app.use(helmet());
  // Prevent HTTP parameter pollution.
  // app.use(hpp());
  // Compress all requests
  // app.use(compression());

  // Use for http request debug (show errors only)
  app.use(morgan('dev'));



  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true)
   // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //  console.log(req.headers);
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', '*');

    // Request headers you wish to allow
   // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Platform');

    // Pass to next layer of middleware
    next();
  });


  // Add headers
/*
  app.use((req, res, next) => {

    console.log(req.headers);

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });
*/

  app.use(mountStore);
  app.use(mountHelper);
  app.use(passportInit);
};
