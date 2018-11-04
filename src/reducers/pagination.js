import union from 'lodash/union';
import { combineReducers } from 'redux';
import Resources from '../constants/Resources';
import { Pagination, Action } from '../types';

type State = Pagination;

export const SET_PAGES = 'SET_PAGES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const APPEND_ENTITIES_INTO_PAGE = 'APPEND_ENTITIES_INTO_PAGE';
export const PREPEND_ENTITIES_INTO_PAGE = 'PREPEND_ENTITIES_INTO_PAGE';
export const REMOVE_ENTITIES_FROM_PAGE = 'REMOVE_ENTITIES_FROM_PAGE';


const resourcePageReducer = (
  state: State = {
    skip: 0,
    limit: 20,
    first: 1,
    current: 1,
    last: 1,
    total: 1
  },
  action: Action
) => {
  switch (action.type) {
    case SET_PAGES: {
      return {
        ...state,
        ...action.page
      };
    }
    case SET_CURRENT_PAGE: {
      return {
        ...state,
        current: action.currentPage
      };
    }
    default: {
      return state;
    }
  }
};

const resourceSinglePageReducer = (
  state = {
    ids: []
  },
  action
) => {
  switch (action.type) {
    case SET_PAGES:
    case APPEND_ENTITIES_INTO_PAGE: {
      return {
        ...state,
        ids: union(state.ids, action.ids)
      };
    }
    case PREPEND_ENTITIES_INTO_PAGE: {
      return {
        ...state,
        ids: union(action.ids, state.ids)
      };
    }
    case REMOVE_ENTITIES_FROM_PAGE: {
      return {
        ...state,
        ids: [...state.ids.filter(id => action.ids.indexOf(id) === -1)]
      };
    }
    default: {
      return state;
    }
  }
};

const resourcePagesReducer = (state: State = {}, action: Action) => {
  switch (action.type) {
    case SET_PAGES: {
      const currPage = action.page.current;

      return {
        ...state,
        [currPage]: resourceSinglePageReducer(state[currPage], action)
      };
    }
    case PREPEND_ENTITIES_INTO_PAGE:
    case APPEND_ENTITIES_INTO_PAGE: {
      const { intoPage } = action;
      return {
        ...state,
        [intoPage]: resourceSinglePageReducer(state[intoPage], action)
      };
    }
    case REMOVE_ENTITIES_FROM_PAGE: {
      const newPages = {};
      for (const pageId in state) {
        newPages[pageId] = resourceSinglePageReducer(state[pageId], action);
      }
      return {
        ...newPages
      };
    }
    default: {
      return state;
    }
  }
};

const resourcePaginationReducer = combineReducers({
  page: resourcePageReducer,
  pages: resourcePagesReducer
});

const paginate = resource => (state = {}, action) => {
  if (action.resource === resource) {
    return resourcePaginationReducer(state, action);
  }
  return resourcePaginationReducer(state, { type: null });
};

const paginationReducer = combineReducers({
  stories: paginate(Resources.STORY),
  users: paginate(Resources.USER),
  comments: paginate(Resources.COMMENT),
  businesses: paginate(Resources.BUSINESS),
  matches: paginate(Resources.MATCH),
  matchResult: paginate(Resources.MATCH_RESULT)
});

export default paginationReducer;
