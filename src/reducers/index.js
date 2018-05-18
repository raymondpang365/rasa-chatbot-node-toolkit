/* @flow */

import { combineReducers } from 'redux';

import cookies from './cookie';
import entity from './entity';
import errors from './error';
import intl from './intl';
import pagination from './pagination';
import statement from './statementDetail';
import statementList from './statementList';
import routing from './router';

const reducers = {
  cookies,
  entity,
  errors,
  statementList,
  intl,
  pagination,
  statement,
  routing
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
