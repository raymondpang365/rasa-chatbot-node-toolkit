/* @flow */

import fp from 'lodash/fp';

import type { CommentList, Action } from '../types';

type State = CommentList;

export const FETCH_COMMENTS_INVALID = 'COMMENTS_INVALID';
export const FETCH_COMMENTS_REQUESTING = 'FETCH_COMMENTS_REQUESTING';
export const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';


const initialState = {
  readyStatus: FETCH_COMMENTS_INVALID,
  err: null,
  list: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_COMMENTS_REQUESTING:
      return fp.assign(state, {
        readyStatus: FETCH_COMMENTS_REQUESTING
      });
    case FETCH_COMMENTS_FAILURE:
      return fp.assign(state, {
        readyStatus: FETCH_COMMENTS_FAILURE,
        err: action.err
      });
    case FETCH_COMMENTS_SUCCESS:
      return fp.assign(state, {
        readyStatus: FETCH_COMMENTS_SUCCESS,
        list: action.data
      });
    default:
      return state;
  }
};
