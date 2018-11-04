/* @flow */

import fp from 'lodash/fp';

import type { Businesses, Action } from '../../types/index';

type State = Businesses;

// Actions


export const MATCH_RESULT_INVALID = 'MATCH_RESULT_INVALID';
export const MATCH_RESULT_REQUESTING = 'MATCH_RESULT_REQUESTING';
export const MATCH_RESULT_FAILURE = 'MATCH_RESULT_FAILURE';
export const MATCH_RESULT_SUCCESS = 'MATCH_RESULT_SUCCESS';

const initialState = {
  readyStatus: MATCH_RESULT_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {

    case MATCH_RESULT_REQUESTING:
      return fp.assign(state, {
        readyStatus: MATCH_RESULT_REQUESTING
      });
    case MATCH_RESULT_FAILURE:
      return fp.assign(state, {
        readyStatus: MATCH_RESULT_FAILURE,
        err: action.err
      });
    case MATCH_RESULT_SUCCESS:
      return fp.assign(state, {
        readyStatus: MATCH_RESULT_SUCCESS,
        data: action.data
      });

    default:
      return state;
  }
};
