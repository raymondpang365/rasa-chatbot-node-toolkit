import localeController from '../../controllers/locale';

export default app => {
  app.get('/api/locales/:locale', localeController.show);
};
