import storyAPI from '../api/stories';
import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

import {
  FETCH_STORY_FAILURE,
  FETCH_STORY_REQUESTING,
  FETCH_STORY_SUCCESS,
  SET_SELECTED_STORY
} from "../reducers/story";

export const setSelectedStory = id => dispatch => {
  dispatch({ type: SET_SELECTED_STORY, storyId: id });
};

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
  storyId: number,
  page
): ThunkAction => async (dispatch: Dispatch, getState: GetState, apiEngine) => {
  dispatch({ type: FETCH_STORY_REQUESTING, storyId });
  try {
    console.log('what the fuck action/story');
    const json = await storyAPI(apiEngine).check(storyId);
    console.log(json);

    /* istanbul ignore next */
    dispatch({ type: FETCH_STORY_SUCCESS, storyId, data: json.data.story });
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
  return story && story.readyStatus !== FETCH_STORY_SUCCESS;
};
/* istanbul ignore next */
export const fetchStoryIfNeeded = (storyId: number): ThunkAction => (
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
