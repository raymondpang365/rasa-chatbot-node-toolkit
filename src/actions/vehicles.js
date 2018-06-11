/* @flow */

import { normalize, schema } from 'normalizr';
import { arrayOfVehicle } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entity';
import { setPages, prependEntitiesIntoPage } from './page';
import vehicleAPI from '../api/vehicle';
import { pushErrors } from './error';

import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

// Export this for unit testing more easily
/* istanbul ignore next */

export const setVehicleList = res => dispatch => {
  console.log(res.vehicles);
  const normalized = normalize(res.vehicles, arrayOfVehicle);

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.VEHICLE, res.page, normalized.result));
};

const shouldFetchVehicles = (state: ReduxState): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  // Fetching data once on vehicleion
  if (state.vehicleList.readyStatus === 'VEHICLES_SUCCESS') return false;

  return true;
};
/* istanbul ignore next */
export const fetchVehicles = (page): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  console.log(`hi ${page}`);
  dispatch({ type: 'VEHICLES_REQUESTING' });
  let json;
  try {
    const state = getState();
    json = await vehicleAPI(apiEngine).list({ page });
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: 'VEHICLES_SUCCESS', data: json.data });

    dispatch(setVehicleList(json.data));
    console.log(getState());
  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: 'VEHICLES_FAILURE', err: err.message });
    console.log(`omg ${err.stack}`);
  }
};

/* istanbul ignore next */
export const fetchVehiclesIfNeeded = (page): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi fuck');
  if (shouldFetchVehicles(getState())) {
    /* istanbul ignore next */
    return dispatch(fetchVehicles(page));
  }
  /* istanbul ignore next */
  return null;
};

export const addVehicleIntoList = vehicle => dispatch => {
  const normalized = normalize([vehicle], arrayOfVehicle);
  dispatch(prependEntitiesIntoPage(Resources.VEHICLE, normalized, 1));
};

export const createVehicle = text => async (dispatch, apiEngine) => {
  let json;
  try {
    console.log('creating Vehicle from actions/vehicle');
    json = await vehicleAPI(apiEngine).create({ text });
    dispatch(addVehicleIntoList(json.data.vehicle));
  } catch (err) {
    dispatch(pushErrors(err));
  }
};

export const updateVehicle = (id, newText) => async (
  dispatch,
  getState,
  apiEngine
) => {
  try {
    await vehicleAPI(apiEngine).update(id, { text: newText });
    await dispatch(fetchVehicles());
  } catch (err) {
    dispatch(pushErrors(err));
  }
};

export const removeVehicleFromList = id =>
  removeEntities(Resources.VEHICLE, [id]);

export const removeVehicle = () => (
  vehicleId: number
): ThunkAction => async (dispatch, apiEngine) => {
  try {
    await vehicleAPI(apiEngine).remove(vehicleId);
    dispatch(removeVehicleFromList(vehicleId));
  } catch (err) {
    dispatch(pushErrors(err));
  }
};
