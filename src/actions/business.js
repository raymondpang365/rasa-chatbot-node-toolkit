import businessAPI from '../api/stories';
import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

import {
  FETCH_BUSINESS_FAILURE,
  FETCH_BUSINESS_REQUESTING,
  FETCH_BUSINESS_SUCCESS,
  SET_SELECTED_BUSINESS
} from "../reducers/business";

export const setSelectedBusiness = id => dispatch => {
  dispatch({ type: SET_SELECTED_BUSINESS, businessId: id });
};

export const addBusiness = values =>
  async (dispatch, getState, apiEngine) => {
    try{
      const json = await businessAPI(apiEngine).create(values);
      console.log(json);
      return json
    } catch (err){
      throw err;
    }
  };

export const fetchBusiness = (
  businessId: number,
  page
): ThunkAction => async (dispatch: Dispatch, getState: GetState, apiEngine) => {
  dispatch({ type: FETCH_BUSINESS_REQUESTING, businessId });
  try {
    console.log('what the fuck action/business');
    const json = await businessAPI(apiEngine).check(businessId);
    console.log(json);

    /* istanbul ignore next */
    dispatch({ type: FETCH_BUSINESS_SUCCESS, businessId, data: json.data.business });
  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: FETCH_BUSINESS_FAILURE, businessId, err: err.message });
  }
};

/* istanbul ignore next */
const shouldFetchBusiness = (
  state: ReduxState,
  businessId: string
): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  const business = state.business[businessId];

  // Fetching data once on production
  return business && business.readyStatus !== FETCH_BUSINESS_SUCCESS;
};
/* istanbul ignore next */
export const fetchBusinessIfNeeded = (businessId: number): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi');
  if (shouldFetchBusiness(getState(), businessId)) {
    /* istanbul ignore next */
    return dispatch(fetchBusiness(businessId));
  }

  /* istanbul ignore next */
  return null;
};
