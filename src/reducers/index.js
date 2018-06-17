/* @flow */

import { combineReducers } from 'redux';

import cookies from './cookie';
import entity from './entity';
import errors from './error';
import intl from './intl';
import registration from './registration';
import pagination from './pagination';
import vehicle from './vehicleDetail';
import vehicleList from './vehicleList';

const reducers = {
  cookies,
  entity,
  errors,
  registration,
  vehicleList,
  intl,
  pagination,
  vehicle
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
