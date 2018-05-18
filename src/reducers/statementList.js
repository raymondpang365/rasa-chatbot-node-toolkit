/* @flow */

import fp from 'lodash/fp';

import type { StatementList, Action } from '../types';

type State = StatementList;

const initialState = {
  readyStatus: 'STATEMENTS_INVALID',
  err: null,
  list: []
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'STATEMENTS_REQUESTING':
      return fp.assign(state, {
        readyStatus: 'STATEMENTS_REQUESTING'
      });
    case 'STATEMENTS_FAILURE':
      return fp.assign(state, {
        readyStatus: 'STATEMENTS_FAILURE',
        err: action.err
      });
    case 'STATEMENTS_SUCCESS':
      return fp.assign(state, {
        readyStatus: 'STATEMENTS_SUCCESS',
        list: action.data
      });
    default:
      return state;
  }
};
