/* @flow */
import Auth0Lock from 'auth0-lock';
import { CALL_API } from 'redux-api-middleware';
import { push } from 'react-router-redux';
import { API_ERROR } from '../Errors/reducer';
import type { State, Dispatch, GetState, ThunkAction, Action } from '../types';

// State
export type AuthState = {
  id: ?string,
  token: ?string,
  login: ?string,
  avatar_url: ?string,
  api_token: ?string,
  isAuthenticated: boolean,
};

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN,
  {
    oidcConformant: true,
    auth: {
      params: {
        scope: 'openid profile',
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        redirectUrl: process.env.REACT_APP_AUTH0_REDIRECT_URL || '',
        responseType: 'token',
      },
    },
    theme: {
      logo: 'https://crick.io/img/logo-crick-square-150px.png',
    },
  }
);

const getToken = () => {
  const token = localStorage.getItem('access_token');

  return token ? token : null;
};

const checkToken = () => {
  return getToken() !== null;
};

const initialState: AuthState = {
  isAuthenticated: checkToken(),
  token: getToken(),
  id: null,
  login: null,
  api_token: null,
  avatar_url: null,
};

// Actions
export const LOGOUT = 'crick/auth/LOGOUT';
const LOGIN_ERROR = 'crick/auth/LOGIN_ERROR';
const LOGIN_SUCCESS = 'crick/auth/LOGIN_SUCCESS';
const FETCH_USER_REQUEST = 'crick/auth/FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'crick/auth/FETCH_USER_SUCCESS';

// Listeners
export const addAuth0Listeners = (dispatch: Dispatch, getState: GetState) => {
  lock.on('authorization_error', error => {
    dispatch(loginError(error));
  });

  lock.on('authenticated', authResult => {
    localStorage.setItem('access_token', authResult.accessToken);

    dispatch(loginSuccess(authResult.accessToken));
  });
};

// Action Creators
export const login = (): ThunkAction => {
  return dispatch => {
    lock.show();
  };
};

const loginError = (error): Action => {
  return { type: LOGIN_ERROR, error };
};

const loginSuccess = (token: string): ThunkAction => {
  return dispatch => {
    dispatch({ type: LOGIN_SUCCESS, token });
    dispatch(fetchUser());
  };
};

export const logout = (): ThunkAction => {
  return dispatch => {
    localStorage.removeItem('access_token');
    dispatch(push('/'));
    dispatch({ type: LOGOUT });
  };
};

export const fetchUser = (): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/users/me`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      types: [FETCH_USER_REQUEST, FETCH_USER_SUCCESS, API_ERROR],
    },
  };
};

// selectors
export const selectAuthState = (state: State): AuthState => {
  return state.auth;
};

// Reducer
export default function reducer(
  state: AuthState = initialState,
  action: Action = {}
): AuthState {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.token,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        login: action.payload.login,
        api_token: action.payload.token,
        avatar_url: action.payload.avatar_url,
      };

    case LOGOUT:
      return {
        ...initialState,
        isAuthenticated: false, // force logout, skip localstorage
      };

    default:
      return state;
  }
}
