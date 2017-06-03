/* @flow */
import type { Action } from '../types';

// State
export type ErrorsState = {
  message: string,
};

const initialState: ErrorsState = {
  message: '',
};

export const DEFAULT_MESSAGE = 'An error has occured, retry later';

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
  state: ErrorsState = initialState,
  action: Action = {}
): ErrorsState {
  switch (action.type) {
    case DISCARD:
      return initialState;

    case API_REQUEST:
      if (action.error === true) {
        return {
          message: action.payload.message || DEFAULT_MESSAGE,
        };
      }

      return state;

    case API_ERROR:
      if (!action.payload) {
        return { message: DEFAULT_MESSAGE };
      }

      if (action.payload.response) {
        return { message: action.payload.response.detail || DEFAULT_MESSAGE };
      }

      return { message: action.payload.message || DEFAULT_MESSAGE };

    default:
      return state;
  }
}
