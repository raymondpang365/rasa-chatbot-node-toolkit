import contactController from '../controllers/contact';



export default app => {
  app.get('/api/contacts', contactController.list);
  app.get('/api/contacts/suggest', contactController.suggest);
};
