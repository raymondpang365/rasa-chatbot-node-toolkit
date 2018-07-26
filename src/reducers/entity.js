import mergeAll from 'lodash/merge';
import { Entity, Action } from '../types/index';

type State = Entity;

export const SET_ENTITIES = 'SET_ENTITIES';

const initState = {};

export default (state: State = initState, action: Action) => {
  switch (action.type) {
    case SET_ENTITIES: {
      return mergeAll({}, [state, action.normalized.entities]);
    }
    default: {
      return state;
    }
  }
};
