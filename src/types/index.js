/* @flow */
/* eslint-disable no-use-before-define */

import type { Store as ReduxStore } from 'redux';

import type { Reducers } from '../reducers';

// Reducers

export type UserInfo = {
  +[userId: string]: {
    +readyStatus: string,
    +err: any,
    +info: Object
  }
};

export type Statement = {
  +[productId: string]: {
    +readyStatus: string,
    +err: any,
    +info: Object
  }
};

export type StatementList = {
  +readyStatus: string,
  +err: any,
  +list: Array<Object>
};

export type Error = {
  +error: any,
  +errors: any,
  +meta: any
};

export type Entity = {
  +resource: any,
  +ids: any,
  +normalized: any
};

export type Pagination = {
  +page: any,
  +currentPage: any,
  +resource: any,
  +ids: any,
  +intoPage: any
};

// State
type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V; // eslint-disable-line no-undef
export type ReduxState = $ObjMap<Reducers, $ExtractFunctionReturn>; // eslint-disable-line no-undef

// Action
export type Action =
  | { type: 'USERS_REQUESTING' }
  | { type: 'USERS_SUCCESS', data: Array<Object> }
  | { type: 'USERS_FAILURE', err: any }
  | { type: 'USER_REQUESTING', userId: string }
  | { type: 'USER_SUCCESS', userId: string, data: Object }
  | { type: 'USER_FAILURE', userId: string, err: any }
  | { type: 'STATEMENTS_REQUESTING' }
  | { type: 'STATEMENTS_SUCCESS', data: Array<Object> }
  | { type: 'STATEMENTS_FAILURE', err: any }
  | { type: 'STATEMENT_REQUESTING', statementId: string }
  | { type: 'STATEMENT_SUCCESS', statementId: string, data: Object }
  | { type: 'STATEMENT_FAILURE', statementId: string, err: any };

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => ReduxState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

// Store
export type Store = ReduxStore<ReduxState, Action>;
