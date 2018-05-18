/* @flow */

import { normalize, schema } from 'normalizr';
import { arrayOfStatement } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entity';
import { setPages, prependEntitiesIntoPage } from './page';
import statementAPI from '../api/statement';
import { pushErrors } from './error';

import type { Dispatch, GetState, ThunkAction, ReduxState } from '../types';

// Export this for unit testing more easily
/* istanbul ignore next */

export const setStatementList = res => dispatch => {
  console.log(res.statements);
  const normalized = normalize(res.statements, arrayOfStatement);

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.STATEMENT, res.page, normalized.result));
};

const shouldFetchStatements = (state: ReduxState): boolean => {
  // On development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  // Fetching data once on statemention
  if (state.statementList.readyStatus === 'STATEMENTS_SUCCESS') return false;

  return true;
};
/* istanbul ignore next */
export const fetchStatements = (page): ThunkAction => async (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  console.log(`hi ${page}`);
  dispatch({ type: 'STATEMENTS_REQUESTING' });
  let json;
  try {
    const state = getState();
    json = await statementAPI(apiEngine).list({ page });
    /* istanbul ignore next */
    console.log(json.data);
    dispatch({ type: 'STATEMENTS_SUCCESS', data: json.data });

    dispatch(setStatementList(json.data));
    console.log(getState());
  } catch (err) {
    /* istanbul ignore next */
    dispatch({ type: 'STATEMENTS_FAILURE', err: err.message });
    console.log(`omg ${err.stack}`);
  }
};

/* istanbul ignore next */
export const fetchStatementsIfNeeded = (page): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  /* istanbul ignore next */
  console.log('hi fuck');
  if (shouldFetchStatements(getState())) {
    /* istanbul ignore next */
    return dispatch(fetchStatements(page));
  }
  /* istanbul ignore next */
  return null;
};

export const addStatementIntoList = statement => dispatch => {
  const normalized = normalize([statement], arrayOfStatement);
  dispatch(prependEntitiesIntoPage(Resources.STATEMENT, normalized, 1));
};

export const createStatement = text => async (dispatch, apiEngine) => {
  let json;
  try {
    console.log('creating Statement from actions/statement');
    json = await statementAPI(apiEngine).create({ text });
    dispatch(addStatementIntoList(json.data.statement));
  } catch (err) {
    dispatch(pushErrors(err));
  }
};

export const updateStatement = (id, newText) => async (
  dispatch,
  getState,
  apiEngine
) => {
  try {
    await statementAPI(apiEngine).update(id, { text: newText });
    await dispatch(fetchStatements());
  } catch (err) {
    dispatch(pushErrors(err));
  }
};

export const removeStatementFromList = id =>
  removeEntities(Resources.STATEMENT, [id]);

export const removeStatement = () => (
  statementId: number
): ThunkAction => async (dispatch, apiEngine) => {
  try {
    await statementAPI(apiEngine).remove(statementId);
    dispatch(removeStatementFromList(statementId));
  } catch (err) {
    dispatch(pushErrors(err));
  }
};
