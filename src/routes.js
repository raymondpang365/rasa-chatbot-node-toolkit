/* @flow */

import React from 'react';
import { Redirect } from 'react-router-dom';

import { fetchStoryIfNeeded } from './actions/story';
import { fetchStoriesIfNeeded } from './actions/stories';
import {
  App,
  asyncHome,
  asyncLogin,
  asyncRegister,
  asyncStoryDetail,
  asyncStoryList,
  asyncVerifyEmail,
  asyncLogout,
  asyncAddStory,
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
        path: '/addstory',
        exact: true,
        component: asyncAddStory,
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
        path: '/story/:id',
        component: asyncStoryDetail,
        loadData: ({ params }: Object) => [fetchStoryIfNeeded(params.id)]
      },
      {
        path: '/feed',
        exact: true,
        component: () => <Redirect to="/feed/page/1" />
      },
      {
        path: '/feed/page/:id',
        component: asyncStoryList,
        loadData: ({ params }: Object) => [fetchStoriesIfNeeded(params.id)]
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
