/* @flow */
import { logout } from '../Auth/reducer';
import type { Middleware } from 'redux';
import { push } from 'react-router-redux';
import type { Action } from '../types';

export default (store: Store): Middleware<Store, Action> => (
  next: Dispatch<Action>
) => (action: Action) => {
  if (action.payload && action.payload.name === 'ApiError') {
    if (action.payload.status === 401) {
      store.dispatch(logout());
    } else if (action.payload.status === 404) {
      store.dispatch(push('/'));
    }
  }

  // Pass the FSA to the next action.
  return next(action);
};
