import users from './common/users';
import forms from './common/forms';
import locales from './common/locales';
import comments from './common/comments';
import stories from './common/stories';
import courses from './common/businesses';
import matches from './common/matches';
import auth from './common/auth';
import react from './web/react';

export default app => {
  users(app);
  forms(app);
  comments(app);
  stories(app);
  courses(app);
  locales(app);
  auth(app);
  matches(app);
  react(app);
};
