import statementAPI from '../api/statement';
import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

export const fetchStatement = (
  statementId: string,
  page
): ThunkAction => async (dispatch: Dispatch, apiEngine) => {
  dispatch({ type: 'STATEMENT_REQUESTING', statementId });
  try {
    const res = await statementAPI(apiEngine).list({ page });

    /* istanbul ignore next */
    dispatch({ type: 'STATEMENT_SUCCESS', statementId, data: res.data });
  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: 'STATEMENT_FAILURE', statementId, err: err.message });
  }
};

/* istanbul ignore next */
const shouldFetchStatement = (
  state: ReduxState,
  statementId: string
): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  const statementDetail = state.statementDetail[statementId];

  // Fetching data once on production
  if (statementDetail && statementDetail.readyStatus === 'STATEMENT_SUCCESS')
    return false;

  return true;
};
/* istanbul ignore next */
export const fetchStatementIfNeeded = (statementId: string): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi');
  if (shouldFetchStatement(getState(), statementId)) {
    /* istanbul ignore next */
    return dispatch(fetchStatement(statementId));
  }

  /* istanbul ignore next */
  return null;
};
