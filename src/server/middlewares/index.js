import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import favicon from 'serve-favicon';
import express from 'express';
import mountStore from './mountStore';
import mountHelper from './mountHelper';
import initCookie from './initCookie';
import passportInit from './passportInit';

const Dotenv = require('dotenv-webpack');

export default app => {
  // Use helmet to secure Express with various HTTP headers
  // app.use(helmet());
  // Prevent HTTP parameter pollution.
  // app.use(hpp());
  // Compress all requests
  // app.use(compression());

  // Use for http request debug (show errors only)
  app.use(morgan('dev'));
  app.use(favicon(path.resolve(process.cwd(), 'public/favicon.ico')));

  if (!__DEV__) {
    app.use(express.static(path.resolve(process.cwd(), 'public')));
  } else {
    /* Run express as webpack dev server */

    const webpack = require('webpack');
    const webpackConfig = require('../../../tools/webpack/config.babel');
    const DashboardPlugin = require('webpack-dashboard/plugin');
    const compiler = webpack(webpackConfig);

    compiler.apply(new webpack.ProgressPlugin());
    compiler.apply(new DashboardPlugin());
    compiler.apply(new Dotenv({
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false // hide any errors
    }))

    app.use(
      require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        quiet: true, // Turn it on for friendly-errors-webpack-plugin
        noInfo: true,
        stats: 'minimal',
        serverSideRender: true
      })
    );

    app.use(
      require('webpack-hot-middleware')(compiler, {
        log: false // Turn it off for friendly-errors-webpack-plugin
      })
    );
  }


  // Add headers
/*
  app.use((req, res, next) => {

    console.log(req.headers);

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });
*/

  app.use(mountStore);
  app.use(mountHelper);

  app.use(initCookie);
  app.use(passportInit);
};
