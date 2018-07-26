/* @flow */

import fp from 'lodash/fp';

import type { Stories, Action } from '../types';

type State = Stories;

// Actions
export const FETCH_STORIES_INVALID = 'FETCH_STORIES_INVALID';
export const FETCH_STORIES_REQUESTING = 'FETCH_STORIES_REQUESTING';
export const FETCH_STORIES_FAILURE = 'FETCH_STORIES_FAILURE';
export const FETCH_STORIES_SUCCESS = 'FETCH_STORIES_SUCCESS';

const initialState = {
  readyStatus: FETCH_STORIES_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_STORIES_REQUESTING:
      return fp.assign(state, {
        readyStatus: FETCH_STORIES_REQUESTING
      });
    case FETCH_STORIES_FAILURE:
      return fp.assign(state, {
        readyStatus: FETCH_STORIES_FAILURE,
        err: action.err
      });
    case FETCH_STORIES_SUCCESS:
      return fp.assign(state, {
        readyStatus: FETCH_STORIES_SUCCESS,
        data: action.data
      });
    default:
      return state;
  }
};
