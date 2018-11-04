/* @flow */

import fp from 'lodash/fp';

import type { Businesses, Action } from '../../types/index';

type State = Businesses;

// Actions


export const JOIN_MATCH_INVALID = 'JOIN_MATCH_INVALID';
export const JOIN_MATCH_REQUESTING = 'JOIN_MATCH_REQUESTING';
export const JOIN_MATCH_FAILURE = 'JOIN_MATCH_FAILURE';
export const JOIN_MATCH_SUCCESS = 'JOIN_MATCH_SUCCESS';

const initialState = {
  readyStatus: JOIN_MATCH_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case JOIN_MATCH_REQUESTING:
      return fp.assign(state, {
        readyStatus: JOIN_MATCH_REQUESTING
      });
    case JOIN_MATCH_FAILURE:
      return fp.assign(state, {
        readyStatus: JOIN_MATCH_FAILURE,
        err: action.err
      });
    case JOIN_MATCH_SUCCESS:
      return fp.assign(state, {
        readyStatus: JOIN_MATCH_SUCCESS,
        data: action.data
      });

    default:
      return state;
  }
};
