/* @flow */

import App from './App';
import asyncAddStory from './AddStoryPage';
import asyncHome from './Home';
import asyncLogin from './user/Login/Login';
import asyncRegister from './user/Register/Register';
import asyncStoryList from './StoryList';
import asyncStoryDetail from './StoryDetail';
import asyncLogout from './user/Logout';
import asyncMatch from './Match';
import asyncSearch from './Search';
import asyncMatchList from './MatchList';
import asyncMatchResult from './MatchResult';
import NotFound from './NotFound';
import asyncVerifyEmail from './user/VerifyEmail';

export {
  App,
  asyncHome,
  asyncMatch,
  asyncMatchList,
  asyncAddStory,
  asyncLogin,
  asyncRegister,
  asyncLogout,
  asyncSearch,
  asyncStoryList,
  asyncStoryDetail,
  asyncVerifyEmail,
  asyncMatchResult,
  NotFound
};
