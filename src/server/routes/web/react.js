import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { getLoadableState } from 'loadable-components/server';
import Helmet from 'react-helmet';
import chalk from 'chalk';

import LocaleProvider from '../../../components/utils/LocaleProvider';
import renderHtml from '../../../helpers/renderHtml';
import routes from '../../../routes';
// $FlowFixMe: isn't an issue
import assets from '../../../../public/webpack-assets.json';


export default app => {
  app.get('*', (req, res) => {
    console.log(req.store.getState());
    // The method for loading data from server-side
    const loadBranchData = (): Promise<any> => {
      const branch = matchRoutes(routes, req.path);

      const promises = branch.map(({ route, match }) => {
        if (route.loadData) {
          console.log('loading data');
          return Promise.all(
            route
              .loadData({ params: match.params, getState: req.store.getState })
              .map(item => req.store.dispatch(item))
          );
        }

        return Promise.resolve(null);
      });

      return Promise.all(promises);
    };

    (async () => {
      try {
        // Load data from server-side first
        await loadBranchData();

        const staticContext = {};
        const AppComponent = (
          <Provider store={req.store}>
            <LocaleProvider>
              {/* Setup React-Router server-side rendering */}
              <StaticRouter location={req.path} context={staticContext}>
                {renderRoutes(routes)}
              </StaticRouter>
            </LocaleProvider>
          </Provider>
        );

        // Check if the render result contains a redirect, if so we need to set
        // the specific status and redirect header and end the response
        if (staticContext.url) {
          res.status(301).setHeader('Location', staticContext.url);
          res.end();

          return;
        }

        // Extract loadable state from application tree (loadable-components setup)
        getLoadableState(AppComponent).then(loadableState => {
          console.log('loaded');
          const head = Helmet.renderStatic();

          // console.log(AppComponent);
          const initialState = req.store.getState();
          const loadableStateTag = loadableState.getScriptTag();

          console.log(loadableStateTag);

          const htmlContent = renderToString(AppComponent);

          console.log(htmlContent);


          // Check page status
          const status = staticContext.status === '404' ? 404 : 200;

          console.log(status);

          // Pass the route and initial state into html template
          res
            .status(status)
            .send(
              renderHtml(
                head,
                assets,
                htmlContent,
                initialState,
                loadableStateTag
              )
            );
        });
      } catch (err) {
        res.status(404).send('Not Found :(');

        console.error(chalk.red(`==> 😭  Rendering routes error: ${err.stack}`));
      }
    })();
  });
};
