/* @flow */

import fp from 'lodash/fp';

import type { Businesses, Action } from '../types';

type State = Businesses;

// Actions
export const FETCH_BUSINESSES_INVALID = 'FETCH_BUSINESSES_INVALID';
export const FETCH_BUSINESSES_REQUESTING = 'FETCH_BUSINESSES_REQUESTING';
export const FETCH_BUSINESSES_FAILURE = 'FETCH_BUSINESSES_FAILURE';
export const FETCH_BUSINESSES_SUCCESS = 'FETCH_BUSINESSES_SUCCESS';

const initialState = {
  readyStatus: FETCH_BUSINESSES_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_BUSINESSES_REQUESTING:
      return fp.assign(state, {
        readyStatus: FETCH_BUSINESSES_REQUESTING
      });
    case FETCH_BUSINESSES_FAILURE:
      return fp.assign(state, {
        readyStatus: FETCH_BUSINESSES_FAILURE,
        err: action.err
      });
    case FETCH_BUSINESSES_SUCCESS:
      return fp.assign(state, {
        readyStatus: FETCH_BUSINESSES_SUCCESS,
        data: action.data
      });
    default:
      return state;
  }
};
