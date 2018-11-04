import { normalize, schema } from 'normalizr';
import { arrayOfStory } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entity';
import { setPages, prependEntitiesIntoPage } from './page';
import matchAPI from '../api/match';
import { pushErrors } from './error';

import {
  SET_SELECTED_MATCH
} from "../reducers/match/selectMatch";

import {
  JOIN_MATCH_REQUESTING,
  JOIN_MATCH_FAILURE,
  JOIN_MATCH_SUCCESS,
} from "../reducers/match/joinMatch";

import {

  CREATE_MATCH_REQUESTING,
  CREATE_MATCH_FAILURE,
  CREATE_MATCH_SUCCESS,

} from "../reducers/match/createMatch";

import {
  MATCH_RESULT_REQUESTING,
  MATCH_RESULT_FAILURE,
  MATCH_RESULT_SUCCESS
} from "../reducers/match/matchResult";

import {
  FETCH_MATCHES_REQUESTING,
  FETCH_MATCHES_FAILURE,
  FETCH_MATCHES_SUCCESS
} from "../reducers/match/fetchMatches";





import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

export const setSelectedMatch = id => dispatch => {
  dispatch({ type: SET_SELECTED_MATCH, matchId: id });
};


export const joinMatch = (id, keywords): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  dispatch({ type: JOIN_MATCH_REQUESTING });
  let json;
  try {
    console.log(keywords);
    const json = await matchAPI(apiEngine).joinMatch(id, keywords);
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: JOIN_MATCH_SUCCESS, data: json.data.matches });

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: JOIN_MATCH_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};

export const createMatch = (): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  dispatch({ type: CREATE_MATCH_REQUESTING });
  let json;
  try {
    const json = await matchAPI(apiEngine).createMatch();
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: CREATE_MATCH_SUCCESS, data: json.data.matchId });

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: CREATE_MATCH_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};

export const matchResult = (id): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  dispatch({ type: MATCH_RESULT_REQUESTING });
  let json;
  try {
    const json = await matchAPI(apiEngine).matchResult(id);
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: MATCH_RESULT_SUCCESS, data: json.data });

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: MATCH_RESULT_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};

const shouldFetchMatches = (state: ReduxState): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  // Fetching data once on story
  return state.matches.readyStatus !== FETCH_MATCHES_SUCCESS;
};


export const fetchMatches = (page): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  console.log(`hi ${page}`);
  dispatch({ type: FETCH_MATCHES_REQUESTING });
  let json;
  try {

    const json = await matchAPI(apiEngine).list({ page });
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: FETCH_MATCHES_SUCCESS, data: json.data.matches });

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: FETCH_MATCHES_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};




/* istanbul ignore next */
export const fetchMatchesIfNeeded = (page): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi fuck');
  if (shouldFetchMatches(getState())) {
    /* istanbul ignore next */
    return dispatch(fetchMatches(page));
  }
  /* istanbul ignore next */
  return null;
};
