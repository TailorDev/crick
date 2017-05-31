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

    case API_ERROR:
      const message = action.payload.response.detail || action.payload.message;

      return {
        message,
      };

    default:
      return state;
  }
}
