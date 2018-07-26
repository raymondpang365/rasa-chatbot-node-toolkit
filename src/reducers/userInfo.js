/* @flow */

import fp from 'lodash/fp';

import type { UserInfo, Action } from '../types';

type State = UserInfo;



export default (state: State = {}, action: Action): State => {
  switch (action.type) {
    case 'FETCH_USER_REQUESTING':
      return fp.assign(state, {
        [action.userId]: {
          readyStatus: 'FETCH_USER_REQUESTING'
        }
      });
    case 'FETCH_USER_FAILURE':
      return fp.assign(state, {
        [action.userId]: {
          readyStatus: 'FETCH_USER_FAILURE',
          err: action.err
        }
      });
    case 'FETCH_USER_SUCCESS':
      return fp.assign(state, {
        [action.userId]: {
          readyStatus: 'FETCH_USER_SUCCESS',
          info: action.data
        }
      });
    default:
      return state;
  }
};
