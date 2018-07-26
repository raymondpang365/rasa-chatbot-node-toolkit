import storyAPI from '../api/stories';
import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

import {
  FETCH_STORY_FAILURE,
  FETCH_STORY_REQUESTING,
  FETCH_STORY_SUCCESS
} from "../reducers/story";

export const addStory = values =>
  async (dispatch, getState, apiEngine) => {
    try{
      const json = await storyAPI(apiEngine).create(values);
      console.log(json);
      return json
    } catch (err){
      throw err;
    }
  };

export const fetchStory = (
  storyId: string,
  page
): ThunkAction => async (dispatch: Dispatch, apiEngine) => {
  dispatch({ type: FETCH_STORY_REQUESTING, storyId });
  try {
    const res = await storyAPI(apiEngine).list({ page });

    /* istanbul ignore next */
    dispatch({ type: FETCH_STORY_SUCCESS, storyId, data: res.data });
  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: FETCH_STORY_FAILURE, storyId, err: err.message });
  }
};

/* istanbul ignore next */
const shouldFetchStory = (
  state: ReduxState,
  storyId: string
): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  const story = state.story[storyId];

  // Fetching data once on production
  if (story && story.readyStatus === FETCH_STORY_SUCCESS)
    return false;

  return true;
};
/* istanbul ignore next */
export const fetchStoryIfNeeded = (storyId: string): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi');
  if (shouldFetchStory(getState(), storyId)) {
    /* istanbul ignore next */
    return dispatch(fetchStory(storyId));
  }

  /* istanbul ignore next */
  return null;
};
