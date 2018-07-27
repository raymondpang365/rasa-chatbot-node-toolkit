/* @flow */

import fp from 'lodash/fp';

import type { Story, Action } from '../types';

type State = Story;

// Actions
export const FETCH_STORY_INVALID = 'FETCH_STORY_INVALID';
export const FETCH_STORY_REQUESTING = 'FETCH_STORY_REQUESTING';
export const FETCH_STORY_FAILURE = 'FETCH_STORY_FAILURE';
export const FETCH_STORY_SUCCESS = 'FETCH_STORY_SUCCESS';
export const SET_STORY = 'SET_STORY';
export const ADD_STORY = 'ADD_STORY';
export const REMOVE_STORY = 'REMOVE_STORY';

const initialState = {
  readyStatus: FETCH_STORY_INVALID,
  err: null,
  data: []
};

export default (state: State = {}, action: Action): State => {
  switch (action.type) {
    case FETCH_STORY_REQUESTING:
      return fp.assign(state, {
        [action.storyId]: {
          readyStatus: FETCH_STORY_REQUESTING
        }
      });
    case FETCH_STORY_FAILURE:
      return fp.assign(state, {
        [action.storyId]: {
          readyStatus: FETCH_STORY_FAILURE,
          err: action.err
        }
      });
    case FETCH_STORY_SUCCESS:
      return fp.assign(state, {
        [action.storyId]: {
          readyStatus: FETCH_STORY_SUCCESS,
          info: action.data
        }
      });
    case SET_STORY:
      return [...action.story];

    case ADD_STORY:
      return [action.story, ...state];

    case REMOVE_STORY:
      return [...state.filter(story => story._id !== action.id)];

    default:
      return state;
  }
};
