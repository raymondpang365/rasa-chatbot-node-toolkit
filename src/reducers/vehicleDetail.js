/* @flow */

import fp from 'lodash/fp';

import type { Vehicle, Action } from '../types';

type State = Vehicle;

export default (state: State = {}, action: Action): State => {
  switch (action.type) {
    case 'VEHICLE_REQUESTING':
      return fp.assign(state, {
        [action.vehicleId]: {
          readyStatus: 'VEHICLE_REQUESTING'
        }
      });
    case 'VEHICLE_FAILURE':
      return fp.assign(state, {
        [action.vehicleId]: {
          readyStatus: 'VEHICLE_FAILURE',
          err: action.err
        }
      });
    case 'VEHICLE_SUCCESS':
      return fp.assign(state, {
        [action.vehicleId]: {
          readyStatus: 'VEHICLE_SUCCESS',
          info: action.data
        }
      });
    case 'SET_VEHICLE': {
      return [...action.vehicles];
    }
    case 'ADD_VEHICLE': {
      return [action.vehicle, ...state];
    }
    case 'REMOVE_VEHICLE': {
      return [...state.filter(vehicle => vehicle._id !== action.id)];
    }
    default:
      return state;
  }
};
