/* @flow */

import { combineReducers } from 'redux';

import comments from './comments';
import cookies from './cookie';
import entity from './entity';
import errors from './error';
import intl from './intl';
import login from './login';
import registration from './registration';
import pagination from './pagination';
import submitStory from './submitStory';
import story from './story';
import stories from './stories';

const reducers = {
  cookies,
  pagination,
  entity,
  errors,
  comments,
  login,
  registration,
  story,
  stories,
  submitStory,
  intl,
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
