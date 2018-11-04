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
  asyncMatchList,
  asyncMatch,
  asyncMatchResult,
  asyncVerifyEmail,
  asyncLogout,
  asyncAddStory,
  asyncSearch,
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
        path: '/matchresult/:id',
        exact: true,
        component: asyncMatchResult
      },
      {
        path: '/matchresult',
        exact: true,
        component:  () => <Redirect to="/matchresult/1" />
      },
      {
        path: '/match/:id',
        exact: true,
        component: asyncMatch
      },
      {
        path: '/match',
        exact: true,
        component:  () => <Redirect to="/match/1" />
      },
      {
        path: '/matchlist',
        exact: true,
        component: asyncMatchList
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
        path: '/user/logout',
        component: asyncLogout
      },
      {
        path: '/addstory',
        component: asyncAddStory
      },
      {
        path: '/search',
        component: asyncSearch,
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
