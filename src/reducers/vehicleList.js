/* @flow */

import fp from 'lodash/fp';

import type { VehicleList, Action } from '../types';

type State = VehicleList;

const initialState = {
  readyStatus: 'VEHICLES_INVALID',
  err: null,
  list: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'VEHICLES_REQUESTING':
      return fp.assign(state, {
        readyStatus: 'VEHICLES_REQUESTING'
      });
    case 'VEHICLES_FAILURE':
      return fp.assign(state, {
        readyStatus: 'VEHICLES_FAILURE',
        err: action.err
      });
    case 'VEHICLES_SUCCESS':
      return fp.assign(state, {
        readyStatus: 'VEHICLES_SUCCESS',
        list: action.data
      });
    default:
      return state;
  }
};
