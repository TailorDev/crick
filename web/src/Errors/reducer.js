/* @flow */
import type { Action } from '../types';

// State
type State = {
  message: string,
};

const initialState: State = {
  message: '',
};

// Actions
export const API_REQUEST = 'crick/errors/API_REQUEST';
export const API_ERROR = 'crick/errors/API_ERROR';
const DISCARD = 'crick/errors/DISCARD';

// Action Creators
export const discard = (): Action => {
  return { type: DISCARD };
};

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action = {}
): State {
  switch (action.type) {
    case DISCARD:
      return initialState;

    case API_REQUEST:
      if (action.error === true) {
        return {
          message: action.payload.message || 'An error has occured, retry later',
        };
      }

      return state;

    case API_ERROR:
      return {
        message: action.payload.response.detail || action.payload.message,
      };

    default:
      return state;
  }
}
