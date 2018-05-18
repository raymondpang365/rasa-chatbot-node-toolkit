/* @flow */

import fp from 'lodash/fp';

import type { Statement, Action } from '../types';

type State = Statement;

export default (state: State = {}, action: Action): State => {
  switch (action.type) {
    case 'STATEMENT_REQUESTING':
      return fp.assign(state, {
        [action.statementId]: {
          readyStatus: 'STATEMENT_REQUESTING'
        }
      });
    case 'STATEMENT_FAILURE':
      return fp.assign(state, {
        [action.statementId]: {
          readyStatus: 'STATEMENT_FAILURE',
          err: action.err
        }
      });
    case 'STATEMENT_SUCCESS':
      return fp.assign(state, {
        [action.statementId]: {
          readyStatus: 'STATEMENT_SUCCESS',
          info: action.data
        }
      });
    case 'SET_STATEMENT': {
      return [...action.statements];
    }
    case 'ADD_STATEMENT': {
      return [action.statement, ...state];
    }
    case 'REMOVE_STATEMENT': {
      return [...state.filter(statement => statement._id !== action.id)];
    }
    default:
      return state;
  }
};
