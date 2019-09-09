import chatbotActionController from '../controllers/cause/inner/actions/index';
import chatbotContextController from '../controllers/cause/inner/context/index';
import chatbotSenderIdController from '../controllers/senderId';
import bodyParser from '../middlewares/bodyParser';
//import testController from '../controllers/test';


export default app => {
  app.post('/api/chatbot/actions', bodyParser.json, chatbotActionController);
  app.post('/api/chatbot/context', bodyParser.json, chatbotContextController);
  app.post('/api/chatbot/sender_id', bodyParser.json, chatbotSenderIdController);
  //app.get('/api/chatbot/test', bodyParser.json, testController.test);
};

