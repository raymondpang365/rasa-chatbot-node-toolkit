/* @flow */

import React from 'react';
import { Redirect } from 'react-router-dom';

import { fetchVehicleIfNeeded } from './actions/vehicle';
import { fetchVehiclesIfNeeded } from './actions/vehicles';
import {
  App,
  asyncHome,
  asyncLogin,
  asyncRegister,
  asyncVehicleDetail,
  asyncVehicleList,
  asyncVerifyEmail,
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
        path: '/user/register',
        exact: true,
        component: asyncRegister,
      },
      {
        path: '/user/logout',
        component: asyncLogout
      },
      {
        path: '/VehicleDetail/:id',
        component: asyncVehicleDetail,
        loadData: ({ params }: Object) => [fetchVehicleIfNeeded(params.id)]
      },
      {
        path: '/vehicle',
        exact: true,
        component: () => <Redirect to="/vehicle/page/1" />
      },
      {
        path: '/vehicle/page/:id',
        component: asyncVehicleList,
        loadData: ({ params }: Object) => [fetchVehiclesIfNeeded(params.id)]
      },
      {
        path: '/user/email/verify',
        component: asyncVerifyEmail
      },
      {
        component: NotFound
      }
    ]
  }
];
