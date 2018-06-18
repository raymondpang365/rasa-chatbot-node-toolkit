/* @flow */

import App from './App';
import asyncHome from './Home';
import asyncLogin from './user/Login/Login';
import asyncRegister from './user/Register/Register';
import asyncVehicleList from './VehicleList';
import asyncVehicleDetail from './VehicleDetail';
import asyncLogout from './user/Logout'
import NotFound from './NotFound';
import asyncVerifyEmail from './user/VerifyEmail'

export {
  App,
  asyncHome,
  asyncLogin,
  asyncRegister,
  asyncLogout,
  asyncVehicleList,
  asyncVehicleDetail,
  asyncVerifyEmail,
  NotFound
};
