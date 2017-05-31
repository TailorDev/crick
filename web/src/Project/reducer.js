/* @flow */
import { CALL_API } from 'redux-api-middleware';
import { LOGOUT } from '../Auth/reducer';
import { API_ERROR } from '../Errors/reducer';
import type {
  Action,
} from '../types';

// State
type State = {
  frames: Array<Object>,
  project: string,
};

const initialState: State = {
  frames: [],
  project: '',
};

// Actions
const FETCH_REQUEST = 'crick/frames/FETCH_REQUEST';
const FETCH_SUCCESS = 'crick/frames/FETCH_SUCCESS';

export const fetchFrames = (id: string): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/frames?projectId=${id}`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      types: [FETCH_REQUEST, FETCH_SUCCESS, API_ERROR],
    },
  };
};

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action = {}
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        frames: action.payload.frames,
        project: action.payload.meta.project.name,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
