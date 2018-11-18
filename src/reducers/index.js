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
import search from './search';
import story from './story';
import stories from './stories';
import business from './business';
import businesses from './businesses';
import joinMatch from './match/joinMatch';
import createMatch from './match/createMatch';
import matchResult from './match/matchResult';
import selectMatch from './match/selectMatch';
import matches from './match/fetchMatches';

const reducers = {
  business,
  businesses,
  cookies,
  createMatch,
  pagination,
  entity,
  errors,
  comments,
  login,
  registration,
  joinMatch,
  matchResult,
  search,
  story,
  stories,
  submitStory,
  selectMatch,
  matches,
  intl
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
