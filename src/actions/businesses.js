/* @flow */

import { normalize, schema } from 'normalizr';
import { arrayOfStory } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entity';
import { setPages, prependEntitiesIntoPage } from './page';
import storyAPI from '../api/businesses';
import { pushErrors } from './error';

import {
  FETCH_BUSINESSES_REQUESTING,
  FETCH_BUSINESSES_FAILURE,
  FETCH_BUSINESSES_SUCCESS
} from "../reducers/businesses";


import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

// Export this for unit testing more easily
/* istanbul ignore next */

export const setStoryList = res => dispatch => {
  console.log(res.businesses);
  const normalized = normalize(res.businesses, arrayOfStory);

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.STORY, res.page, normalized.result));
};

const shouldFetchBusinesses = (state: ReduxState): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  // Fetching data once on story
  return state.businesses.readyStatus !== FETCH_BUSINESSES_SUCCESS ;
};


export const fetchBusinesses = (page): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  console.log(`hi ${page}`);
  dispatch({ type: FETCH_BUSINESSES_REQUESTING });
  let json;
  try {

    const json = await storyAPI(apiEngine).list({ page });
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: FETCH_BUSINESSES_SUCCESS, data: json.data.businesses });

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: FETCH_BUSINESSES_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};




/* istanbul ignore next */
export const fetchBusinessesIfNeeded = (page): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi fuck');
  if (shouldFetchBusinesses(getState())) {
    /* istanbul ignore next */
    return dispatch(fetchBusinesses(page));
  }
  /* istanbul ignore next */
  return null;
};

export const addStoryIntoList = story => dispatch => {
  const normalized = normalize([story], arrayOfStory);
  dispatch(prependEntitiesIntoPage(Resources.STORY, normalized, 1));
};

export const createStory = text => async (dispatch, apiEngine) => {
  let json;
  try {
    console.log('creating Story from actions/story');
    json = await storyAPI(apiEngine).create({ text });
    dispatch(addStoryIntoList(json.data.story));
  } catch (err) {
    dispatch(pushErrors(err));
  }
};

export const updateStory = (id, newText) => async (
  dispatch,
  getState,
  apiEngine
) => {
  try {
    await storyAPI(apiEngine).update(id, { text: newText });
    await dispatch(fetchBusinesses());
  } catch (err) {
    dispatch(pushErrors(err));
  }
};

export const removeStoryFromList = id =>
  removeEntities(Resources.STORY, [id]);

export const removeStory = () => (
  storyId: number
): ThunkAction => async (dispatch, apiEngine) => {
  try {
    await storyAPI(apiEngine).remove(storyId);
    dispatch(removeStoryFromList(storyId));
  } catch (err) {
    dispatch(pushErrors(err));
  }
};
