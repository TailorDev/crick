/* @flow */
import Auth0Lock from 'auth0-lock';
import type {
  ThunkAction,
  Action,
} from '../types';

// State
type State = {
  isAuthenticated: boolean,
  token: ?string,
};

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN,
  {
    auth: {
      params: {
        scope: 'openid',
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        responseType: 'token',
      },
    },
  }
);

const checkToken = () => {
  return null !== localStorage.getItem('access_token');
}

const initialState: State = {
  isAuthenticated: checkToken(),
  token: localStorage.getItem('access_token'),
};

// Actions
const LOGIN_ERROR = 'crick/auth/LOGIN_ERROR';
const LOGIN_SUCCESS = 'crick/auth/LOGIN_SUCCESS';
const LOGOUT = 'crick/auth/LOGOUT';

// Listeners
export const addAuth0Listeners = (dispatch: Function, getState: Function) => {
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

const loginSuccess = (token: string): Action => {
  return { type: LOGIN_SUCCESS, token };
};

export const logout = (): Action => {
  localStorage.removeItem('access_token');

  return { type: LOGOUT };
};

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action = {}
): State {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        token: action.token,
      };

    case LOGOUT:
      return {
        isAuthenticated: false,
        token: null,
      };

    default:
      return state;
  }
}
