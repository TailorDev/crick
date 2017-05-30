/* @flow */
import { CALL_API } from 'redux-api-middleware';
import { LOGOUT } from '../Auth/reducer';
import type {
  ThunkAction,
    Action,
    Team,
} from '../types';

// State
type State = {
  newTeam: ?Team,
  teams: Array<Team>,
};

const initialState: State = {
  newTeam: null,
  teams: [],
};

// Actions
const FETCH_REQUEST = 'crick/teams/FETCH_REQUEST';
const FETCH_SUCCESS = 'crick/teams/FETCH_SUCCESS';
const FETCH_FAILURE = 'crick/teams/FETCH_FAILURE';
const CREATE_REQUEST = 'crick/teams/CREATE_REQUEST';
const CREATE_SUCCESS = 'crick/teams/CREATE_SUCCESS';
const CREATE_FAILURE = 'crick/teams/CREATE_FAILURE';
const SET_NEW_TEAM = 'crick/teams/SET_NEW_TEAM';

// Action Creators
export const fetchTeams = (): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/teams`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      types: [FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE],
    },
  };
};

export const createTeam = (team: Team): ThunkAction => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: SET_NEW_TEAM, team });

    dispatch({
      [CALL_API]: {
        endpoint: `${process.env.REACT_APP_API_HOST || ''}/teams`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
        types: [CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE],
      },
    });
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
        ...state,
        teams: action.payload.teams,
      };

    case SET_NEW_TEAM:
      return {
        ...state,
        newTeam: action.team,
      };

    case CREATE_SUCCESS:
      const { newTeam, teams } = state;

      if (newTeam) {
        return {
          newTeam: null,
          teams: teams.concat({
            ...newTeam,
            id: action.payload.id,
          }),
        };
      }

      return state;

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
