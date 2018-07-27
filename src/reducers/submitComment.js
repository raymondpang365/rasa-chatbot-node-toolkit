// QUACK! This is a duck. https://github.com/erikras/ducks-modular-redux

// Actions
export const SUBMIT_COMMENT = 'SUBMIT_COMMENT';
export const SUBMIT_COMMENT_SUCCESS = 'SUBMIT_COMMENT_SUCCESS';
export const SUBMIT_COMMENT_FAILURE = 'SUBMIT_COMMENT_FAILURE';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SUBMIT_COMMENT:
      return {
        ...state,
        submitting: true
      };
    case SUBMIT_COMMENT_SUCCESS:
      return {
        ...state,
        submitting: false
      };
    case SUBMIT_COMMENT_FAILURE:
      return {
        ...state,
        submitting: false
      };
    default:
      return state
  }
}

// Action Creators

// Selectors
