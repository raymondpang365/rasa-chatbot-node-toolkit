// QUACK! This is a duck. https://github.com/erikras/ducks-modular-redux

// Actions
export const SUBMIT_STORY = 'SUBMIT_STORY';
export const SUBMIT_STORY_SUCCESS = 'SUBMIT_STORY_SUCCESS';
export const SUBMIT_STORY_FAILURE = 'SUBMIT_STORY_FAILURE';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SUBMIT_STORY:
      return {
        ...state,
        registering: true
      };
    case SUBMIT_STORY_SUCCESS:
      return {
        ...state,
        registering: false
      };
    case SUBMIT_STORY_FAILURE:
      return {
        ...state,
        registering: false
      };
    default:
      return state
  }
}

// Action Creators

// Selectors
