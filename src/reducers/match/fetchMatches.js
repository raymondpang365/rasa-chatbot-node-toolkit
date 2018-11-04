/* @flow */

import fp from 'lodash/fp';

import type { Matches, Action } from '../../types';

type State = Matches;

// Actions
export const FETCH_MATCHES_INVALID = 'FETCH_MATCHES_INVALID';
export const FETCH_MATCHES_REQUESTING = 'FETCH_MATCHES_REQUESTING';
export const FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE';
export const FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS';

const initialState = {
  readyStatus: FETCH_MATCHES_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_MATCHES_REQUESTING:
      return fp.assign(state, {
        readyStatus: FETCH_MATCHES_REQUESTING
      });
    case FETCH_MATCHES_FAILURE:
      return fp.assign(state, {
        readyStatus: FETCH_MATCHES_FAILURE,
        err: action.err
      });
    case FETCH_MATCHES_SUCCESS:
      return fp.assign(state, {
        readyStatus: FETCH_MATCHES_SUCCESS,
        data: action.data
      });
    default:
      return state;
  }
};

