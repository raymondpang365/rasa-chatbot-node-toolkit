/* eslint-disable */
/* @flow */

import express from 'express';
import React from 'react';
import chalk from 'chalk';
import { port, listenTo } from '../config/index';
import middlewares from './middlewares';
import serverRoutes from './routes';

const app = express();

middlewares(app);
serverRoutes(app);

if (port && listenTo) {
  const server = (process.env.NODE_ENV === "production") ? () => {
      const fs = require('fs');
      const privateKey = fs.readFileSync('../.sslcert/privkey.pem', 'utf8');
      const certificate = fs.readFileSync('../.sslcert/fullchain.pem', 'utf8');
      const credentials = {key: privateKey, cert: certificate};
      const https = require('https');
      return https.createServer(credentials, app);
    }
    : () => {
      const http = require('http');
      return http.createServer(app);
    };
  server().listen(port, listenTo, err => {
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


