/* @flow */

import fp from 'lodash/fp';

import type { Businesses, Action } from '../types/index';

type State = Businesses;

// Actions


export const SEARCH_INVALID = 'SEARCH_INVALID';
export const SEARCH_REQUESTING = 'SEARCH_REQUESTING';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';

const initialState = {
  readyStatus: SEARCH_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {

    case SEARCH_REQUESTING:
      return fp.assign(state, {
        readyStatus: SEARCH_REQUESTING
      });
    case SEARCH_FAILURE:
      return fp.assign(state, {
        readyStatus: SEARCH_FAILURE,
        err: action.err
      });
    case SEARCH_SUCCESS:
      return fp.assign(state, {
        readyStatus: SEARCH_SUCCESS,
        data: action.data
      });

    default:
      return state;
  }
};
