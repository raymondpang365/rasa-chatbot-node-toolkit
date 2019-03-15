import mailController from '../controllers/mail';

export default app => {
  app.get('/api/testmail', mailController.sendTestMail);
};
