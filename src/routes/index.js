import users from './users';
import forms from './forms';
import locales from './locales';
import comments from './comments';
import stories from './stories';
import search from './search';
import courses from './businesses';
import matches from './matches';
import auth from './auth';
import tags from './tags';
import mail from './mail';

export default app => {
  users(app);
  forms(app);
  comments(app);
  stories(app);
  courses(app);
  locales(app);
  auth(app);
  tags(app);
  matches(app);
  search(app);
  mail(app);
};
