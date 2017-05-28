import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';
import { addAuth0Listeners } from '../Auth/reducer';

const middlewares = [thunk];

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(
    rootReducer,
    initialState,
    'production' !== process.env.NODE_ENV && 'undefined' !== typeof window &&
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  );

  addAuth0Listeners(store.dispatch, store.getState);

  return store;
};
