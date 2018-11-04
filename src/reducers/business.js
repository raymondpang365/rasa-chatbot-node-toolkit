/* @flow */

import fp from 'lodash/fp';

import type { Business, Action } from '../types';

type State = Business;

// Actions
export const SET_SELECTED_BUSINESS = 'SET_SELECTED_BUSINESS';
export const FETCH_BUSINESS_INVALID = 'FETCH_BUSINESS_INVALID';
export const FETCH_BUSINESS_REQUESTING = 'FETCH_BUSINESS_REQUESTING';
export const FETCH_BUSINESS_FAILURE = 'FETCH_BUSINESS_FAILURE';
export const FETCH_BUSINESS_SUCCESS = 'FETCH_BUSINESS_SUCCESS';
export const SET_BUSINESS = 'SET_BUSINESS';
export const ADD_BUSINESS = 'ADD_BUSINESS';
export const REMOVE_BUSINESS = 'REMOVE_BUSINESS';

const initialState = {
  selected: 0,
  readyStatus: FETCH_BUSINESS_INVALID,
  err: null,
  data: []
};

export default (state: State = {}, action: Action): State => {
  switch (action.type) {
    case SET_SELECTED_BUSINESS:
      return fp.assign(state, {
        selected: action.businessId
      });
    case FETCH_BUSINESS_REQUESTING:
      return fp.assign(state, {
        [action.businessId]: {
          readyStatus: FETCH_BUSINESS_REQUESTING
        }
      });
    case FETCH_BUSINESS_FAILURE:
      return fp.assign(state, {
        [action.businessId]: {
          readyStatus: FETCH_BUSINESS_FAILURE,
          err: action.err
        }
      });
    case FETCH_BUSINESS_SUCCESS:
      return fp.assign(state, {
        [action.businessId]: {
          readyStatus: FETCH_BUSINESS_SUCCESS,
          info: action.data
        }
      });
    case SET_BUSINESS:
      return [...action.business];

    case ADD_BUSINESS:
      return [action.business, ...state];

    case REMOVE_BUSINESS:
      return [...state.filter(business => business._id !== action.id)];

    default:
      return state;
  }
};
