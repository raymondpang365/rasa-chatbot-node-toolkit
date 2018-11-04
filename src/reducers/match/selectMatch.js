/* @flow */

import fp from 'lodash/fp';

import type { Story, Action } from '../../types';

type State = Story;

// Actions
export const SET_SELECTED_MATCH = 'SET_SELECTED_MATCH';


const initialState = {
  selected: 0,
};

export default (state: State = {}, action: Action): State => {
  switch (action.type) {
    case SET_SELECTED_MATCH:
      return fp.assign(state, {
        selected: action.matchId
      });
    default:
      return state;
  }
};
