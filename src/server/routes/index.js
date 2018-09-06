import users from './common/users';
import forms from './common/forms';
import locales from './common/locales';
import comments from './common/comments';
import stories from './common/stories';
import courses from './common/courses';
import requests from './common/requests';
import auth from './common/auth';
import react from './web/react';

export default app => {
  users(app);
  forms(app);
  comments(app);
  stories(app);
  courses(app);
  requests(app);
  locales(app);
  auth(app);
  react(app);
};
