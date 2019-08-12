import morgan from 'morgan';
import mountStore from './mountStore';
import mountHelper from './mountHelper';
import passportInit from './passportInit';
import express from 'express';

//import wechat from '../chatbot/wechat';

export default app => {

  // Use for http request debug (show errors only)
  //app.use(morgan('dev'));

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

  app.use(mountStore);
  app.use(mountHelper);
  app.use(passportInit);

require('../controllers/chatbot/cause/outer/index');
require('../controllers/chatbot/announcement/schedule');

 // app.use(express.query());
//  app.use('/wechat', wechat);
};
