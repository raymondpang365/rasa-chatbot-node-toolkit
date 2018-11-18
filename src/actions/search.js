import { normalize, schema } from 'normalizr';
import { arrayOfStory } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entity';
import { setPages, prependEntitiesIntoPage } from './page';
import searchAPI from '../api/search';
import { pushErrors } from './error';
import redirect from './route';


import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

import {
  SEARCH_REQUESTING,
  SEARCH_FAILURE,
  SEARCH_SUCCESS
} from "../reducers/search";

const searchDispatch = (query): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  dispatch({ type: SEARCH_REQUESTING });
  let json;
  console.log('calling match result action');
  try {
    const json = await searchAPI(apiEngine).search(query);
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: SEARCH_SUCCESS, data: json.data });

    console.log(getState());

  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: SEARCH_FAILURE, err: err.message });
    console.log(`omg ${err.stack}`);
  }
};

export default searchDispatch
