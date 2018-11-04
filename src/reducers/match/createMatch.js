/* @flow */

import fp from 'lodash/fp';

import type { Businesses, Action } from '../../types/index';

type State = Businesses;

// Actions
export const CREATE_MATCH_INVALID = 'CREATE_MATCH_INVALID';
export const CREATE_MATCH_REQUESTING = 'CREATE_MATCH_REQUESTING';
export const CREATE_MATCH_FAILURE = 'CREATE_MATCH_FAILURE';
export const CREATE_MATCH_SUCCESS = 'CREATE_MATCH_SUCCESS';


const initialState = {
  readyStatus: CREATE_MATCH_INVALID,
  err: null,
  data: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {



    case CREATE_MATCH_REQUESTING:
      return fp.assign(state, {
        readyStatus: CREATE_MATCH_REQUESTING
      });
    case CREATE_MATCH_FAILURE:
      return fp.assign(state, {
        readyStatus: CREATE_MATCH_FAILURE,
        err: action.err
      });
    case CREATE_MATCH_SUCCESS:
      return fp.assign(state, {
        readyStatus: CREATE_MATCH_SUCCESS,
        data: action.data
      });
    default:
      return state;
  }
};
