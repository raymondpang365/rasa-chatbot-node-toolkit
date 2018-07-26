import { setEntities } from './entity';

import type { Dispatch, ThunkAction } from '../types';

export const setPages = (resource, page, ids): ThunkAction => dispatch => {
  dispatch({ type: 'SET_PAGES', resource, page, ids });
};

export const setCurrentPage = (resource, currentPage): ThunkAction => (
  dispatch: Dispatch
) => {
  dispatch({ type: 'SET_CURRENT_PAGE', resource, currentPage });
};

export const prependEntitiesIntoPage = (
  resource,
  normalized,
  intoPage
): ThunkAction => dispatch => {
  dispatch(setEntities(normalized));
  dispatch({
    type: 'PREPEND_ENTITIES_INTO_PAGE',
    resource,
    ids: normalized.result,
    intoPage
  });
};

export const appendEntitiesIntoPage = (
  resource,
  normalized,
  intoPage
): ThunkAction => dispatch => {
  dispatch(setEntities(normalized));
  dispatch({
    type: 'APPEND_ENTITIES_INTO_PAGE',
    resource,
    ids: normalized.result,
    intoPage
  });
};
