// QUACK! This is a duck. https://github.com/erikras/ducks-modular-redux

// Actions
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false
      };
    default:
      return state
  }
}

// Action Creators

// Selectors
