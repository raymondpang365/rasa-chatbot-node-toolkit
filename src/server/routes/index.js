import users from './common/users';
import forms from './common/forms';
import locales from './common/locales';
import tests from './common/tests';
import kits from './common/kits';
import auth from './common/auth';
import react from './web/react';

export default app => {
  users(app);
  forms(app);
  tests(app);
  kits(app);
  locales(app);
  auth(app);
  react(app);
};
