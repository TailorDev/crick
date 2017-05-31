/* @flow */
import { CALL_API } from 'redux-api-middleware';
import { LOGOUT } from '../Auth/reducer';
import type { User, ThunkAction, Action, Team, NewTeam } from '../types';

// State
type State = {
  newTeam: ?NewTeam,
  teams: Array<Team>,
  suggestedUsers: Array<User>,
};

const initialState: State = {
  newTeam: null,
  teams: [],
  suggestedUsers: [],
};

// Actions
const FETCH_REQUEST = 'crick/teams/FETCH_REQUEST';
const FETCH_SUCCESS = 'crick/teams/FETCH_SUCCESS';
const FETCH_FAILURE = 'crick/teams/FETCH_FAILURE';
const CREATE_REQUEST = 'crick/teams/CREATE_REQUEST';
const CREATE_SUCCESS = 'crick/teams/CREATE_SUCCESS';
const CREATE_FAILURE = 'crick/teams/CREATE_FAILURE';
const SET_NEW_TEAM = 'crick/teams/SET_NEW_TEAM';
const FETCH_USERS_REQUEST = 'crick/teams/FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'crick/teams/FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'crick/teams/FETCH_USERS_FAILURE';
const UPDATE_REQUEST = 'crick/teams/UPDATE_REQUEST';
const UPDATE_SUCCESS = 'crick/teams/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'crick/teams/UPDATE_FAILURE';

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

export const createTeam = (team: NewTeam): ThunkAction => {
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
        body: JSON.stringify({
          name: team.name,
          projects: team.projects,
          user_ids: team.users.map(u => u.id),
        }),
        types: [CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE],
      },
    });
  };
};

export const updateTeam = (team: Team): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/teams/${team.id}`,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: team.id,
        name: team.name,
        projects: team.projects,
        user_ids: team.users.map(u => u.id),
      }),
      types: [UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE],
    },
  };
};

export const autoCompleteUsers = (input: string): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/users?q=${input}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      types: [FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE],
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
          ...state,
          newTeam: null,
          teams: teams.concat({
            ...newTeam,
            id: action.payload.id,
          }),
        };
      }

      return state;

    case UPDATE_SUCCESS:
      const editedTeam = action.payload;
      const updatedTeams = state.teams.map(team => {
        if (team.id === editedTeam.id) {
          return editedTeam;
        }

        return team;
      });

      return {
        ...state,
        teams: updatedTeams,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        suggestedUsers: action.payload.users,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
