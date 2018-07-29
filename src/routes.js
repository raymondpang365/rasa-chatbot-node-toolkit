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
        path: '/story/:id',
        exact: true,
        component: asyncStoryDetail,
      },
      {
        path: '/story',
        exact: true,
        component: () => <Redirect to="/story/1" />
      },
      {
        path: '/feed/page/:id',
        component: asyncStoryList,
      },
      {
        path: '/feed',
        exact: true,
        component: () => <Redirect to="/feed/page/1" />
      },
      {
        path: '/user/register',
        component: asyncRegister
      },
      {
        path: '/user/login',
        component: asyncLogin
      },
      {
        path: '/addstory',
        component: asyncAddStory
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
