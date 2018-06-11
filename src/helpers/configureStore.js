/* @flow */

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import type { Store } from '../types';
import rootReducer from '../reducers';
import ApiEngine from '../helpers/apiEngine';

export default (history: Object, initialState: Object = {}): Store => {
  const apiEngine = new ApiEngine();
  const middlewares = [
    thunk.withExtraArgument(apiEngine),
    routerMiddleware(history)
    // Add other middlewares here
  ];
  const composeEnhancers =
    (typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const enhancers = composeEnhancers(
    applyMiddleware(...middlewares)
    // Add other enhancers here
  );


  const store = createStore(connectRouter(history)(rootReducer), initialState, enhancers);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      try {
        const nextReducer = require('../reducers').default;

        store.replaceReducer(nextReducer);
      } catch (error) {
        console.error(`==> 😭  ReduxState hot reloading error ${error}`);
      }
    });
  }

  return store;
};
