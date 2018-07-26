/* @flow */

import { normalize, schema } from 'normalizr';
import { arrayOfStory } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entity';
import { setPages, prependEntitiesIntoPage } from './page';
import storyAPI from '../api/stories';
import { pushErrors } from './error';

import {
  FETCH_STORIES_REQUESTING,
  FETCH_STORIES_FAILURE,
  FETCH_STORIES_SUCCESS
} from "../reducers/stories";


import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

// Export this for unit testing more easily
/* istanbul ignore next */

export const setStoryList = res => dispatch => {
  console.log(res.stories);
  const normalized = normalize(res.stories, arrayOfStory);

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.STORY, res.page, normalized.result));
};

const shouldFetchStories = (state: ReduxState): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  // Fetching data once on story
  return state.stories.readyStatus !== FETCH_STORIES_SUCCESS ;
};


export const fetchStories = (page): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  console.log(`hi ${page}`);
  dispatch({ type: FETCH_STORIES_REQUESTING });
  let json;
  try {

    const json = await storyAPI(apiEngine).list({ page });
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: FETCH_STORIES_SUCCESS, data: json.data.stories });

   // dispatch(setStoryList(json.data));

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: FETCH_STORIES_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};



/* istanbul ignore next */
export const fetchStoriesIfNeeded = (page): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi fuck');
  if (shouldFetchStories(getState())) {
    /* istanbul ignore next */
    return dispatch(fetchStories(page));
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
    await dispatch(fetchStories());
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
