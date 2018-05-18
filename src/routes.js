/* @flow */

import React from 'react';
import { Redirect } from 'react-router-dom';

import { fetchStatementIfNeeded } from './actions/statement';
import { fetchStatementsIfNeeded } from './actions/statements';
import {
  App,
  asyncHome,
  asyncLogin,
  asyncStatementDetail,
  asyncStatementList,
  asyncLogout,
  NotFound
} from './containers';

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: asyncHome
      },
      {
        path: '/user/login',
        exact: true,
        component: asyncLogin,
      },
      {
        path: '/user/logout',
        component: asyncLogout
      },
      {
        path: '/StatementDetail/:id',
        component: asyncStatementDetail,
        loadData: ({ params }: Object) => [fetchStatementIfNeeded(params.id)]
      },
      {
        path: '/statement',
        exact: true,
        component: () => <Redirect to="/statement/page/1" />
      },
      {
        path: '/statement/page/:id',
        component: asyncStatementList,
        loadData: ({ params }: Object) => [fetchStatementsIfNeeded(params.id)]
      },
      {
        component: NotFound
      }
    ]
  }
];
