/* @flow */
import { CALL_API } from 'redux-api-middleware';
import { LOGOUT } from '../Auth/reducer';
import type {
  Action,
} from '../types';

// State
type State = {
  projects: Array<Object>,
};

const initialState: State = {
  projects: [],
};

// Actions
const FETCH_REQUEST = 'crick/projects/FETCH_REQUEST';
const FETCH_SUCCESS = 'crick/projects/FETCH_SUCCESS';
const FETCH_FAILURE = 'crick/projects/FETCH_FAILURE';

export const fetchProjects = (): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/projects`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      types: [FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE],
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
        projects: action.payload.projects,
      };

    case LOGOUT:
      return {
        projects: [],
      };

    default:
      return state;
  }
}
