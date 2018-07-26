import { Error, Action } from '../types/index';

type State = Error;

const initState = [];

export const PUSH_ERRORS = 'PUSH_ERRORS';
export const REMOVE_ERROR = 'REMOVE_ERROR';


export default (state: State = initState, action: Action) => {
  if (!action.errors) {
    action.errors = [];
  }
  switch (action.type) {
    case PUSH_ERRORS: {
      return [
        ...state,
        ...action.errors.map(error => ({
          id: Math.random(),
          ...error
        }))
      ];
    }
    case REMOVE_ERROR: {
      return [...state.filter(error => error.id !== action.id)];
    }
    default: {
      return state;
    }
  }
};
