/* @flow */
import { CALL_API } from 'redux-api-middleware';
import type { Middleware } from 'redux';
import type { Action } from '../types';

export default (store: Store): Middleware<Store, Action> => (next: Dispatch<Action>) => (action: Action) => {
  const callApi = action[CALL_API];

  // Check if this action is a redux-api-middleware action.
  if (callApi) {
    const { auth } = store.getState();

    // Inject the Authorization header from localStorage.
    callApi.headers = Object.assign({}, callApi.headers, {
      Authorization: `Bearer ${auth.token}`,
    });
  }

  // Pass the FSA to the next action.
  return next(action);
};
