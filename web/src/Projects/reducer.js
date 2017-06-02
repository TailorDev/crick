/* @flow */
import { CALL_API } from 'redux-api-middleware';
import { LOGOUT } from '../Auth/reducer';
import { API_ERROR } from '../Errors/reducer';
import type { Action } from '../types';
import { sortByName } from '../utils';

// State
type State = {
  projects: ?Array<Object>,
};

const initialState: State = {
  projects: null,
};

// Actions
const FETCH_REQUEST = 'crick/projects/FETCH_REQUEST';
const FETCH_SUCCESS = 'crick/projects/FETCH_SUCCESS';

export const fetchProjects = (): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/projects`,
      method: 'GET',
      headers: { Accept: 'application/json' },
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
      const projects = action.payload.projects;
      projects.sort(sortByName);
      return {
        projects: projects,
      };

    case LOGOUT:
      return {
        projects: [],
      };

    default:
      return state;
  }
}
