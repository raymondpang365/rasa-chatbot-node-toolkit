/* @flow */

import React from 'react';
// $FlowFixMe: isn't an issue
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Switch, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';
import { loadComponents } from 'loadable-components';
import configureStore from './helpers/configureStore';
import routes from './routes';
import LocaleProvider from './components/utils/LocaleProvider';


// Get the initial state from server-side rendering
const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = configureStore(history, initialState);

// Load all components needed before starting rendering (loadable-components setup)
loadComponents().then(() => {
  hydrate(
    <Provider store={store}>
      <LocaleProvider>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </LocaleProvider>
    </Provider>,
    document.getElementById('react-view')
  );
});
