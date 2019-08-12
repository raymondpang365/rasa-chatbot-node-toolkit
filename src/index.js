import express from 'express';
import chalk from 'chalk';
import { port, host } from './config';
import middlewares from './middlewares';
import serverRoutes from './routes';

const app = express();

middlewares(app);
serverRoutes(app);
const cron = require('node-cron');

if (port) {

  app.listen(port, host, err => {
    const url = `http://${host}:${port}`;

    if (err) console.error(chalk.red(`==> 😭  OMG!!! ${err}`));

    console.info(chalk.green(`==> 🌎  Listening at ${url}`));

    process.on('uncaughtException', function(e) {
      console.log('An error has occured. error is: %s and stack trace is: %s', e, e.stack);
      console.log("Process will restart now.");
      process.exit(1);
    })

  });
} else {
  console.error(
    chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified')
  );
}



