import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';

import rootReducer from './rootReducer';
import apiAuthToken from '../middleware/apiAuthToken';
import { addAuth0Listeners } from '../Auth/reducer';

const middleware = [thunk, apiAuthToken, apiMiddleware];

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(
    rootReducer,
    initialState,
    'production' !== process.env.NODE_ENV &&
      'undefined' !== typeof window &&
      window.devToolsExtension
      ? window.devToolsExtension()
      : f => f
  );

  addAuth0Listeners(store.dispatch, store.getState);

  return store;
}
