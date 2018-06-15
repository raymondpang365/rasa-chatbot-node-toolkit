/* eslint-disable */
/* @flow */

import express from 'express';
import React from 'react';
import chalk from 'chalk';
import { jwt, port, listenTo } from '../config/index';
import middlewares from './middlewares';
import serverRoutes from './routes';

const app = express();

middlewares(app);
serverRoutes(app);

if (port && listenTo) {
  app.listen(port, listenTo, err => {
    console.log(jwt.accessToken.secret);
    const url = `http://${listenTo}:${port}`;

    if (err) console.error(chalk.red(`==> 😭  OMG!!! ${err}`));

    console.info(chalk.green(`==> 🌎  Listening at ${url}`));

    // Open Chrome
    // require('../../tools/openBrowser/index')(url);
  });
} else {
  console.error(
    chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified')
  );
}


