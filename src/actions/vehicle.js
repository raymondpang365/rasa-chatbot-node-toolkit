import vehicleAPI from '../api/vehicle';
import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

export const fetchVehicle = (
  vehicleId: string,
  page
): ThunkAction => async (dispatch: Dispatch, apiEngine) => {
  dispatch({ type: 'VEHICLE_REQUESTING', vehicleId });
  try {
    const res = await vehicleAPI(apiEngine).list({ page });

    /* istanbul ignore next */
    dispatch({ type: 'VEHICLE_SUCCESS', vehicleId, data: res.data });
  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: 'VEHICLE_FAILURE', vehicleId, err: err.message });
  }
};

/* istanbul ignore next */
const shouldFetchVehicle = (
  state: ReduxState,
  vehicleId: string
): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  const vehicleDetail = state.vehicleDetail[vehicleId];

  // Fetching data once on production
  if (vehicleDetail && vehicleDetail.readyStatus === 'VEHICLE_SUCCESS')
    return false;

  return true;
};
/* istanbul ignore next */
export const fetchVehicleIfNeeded = (vehicleId: string): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi');
  if (shouldFetchVehicle(getState(), vehicleId)) {
    /* istanbul ignore next */
    return dispatch(fetchVehicle(vehicleId));
  }

  /* istanbul ignore next */
  return null;
};
