/* @flow */
import Auth0Lock from 'auth0-lock';
import type {
  ThunkAction,
  Action,
} from '../types';

// State
type State = {
  isAuthenticated: boolean,
};

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN
);

const checkToken = () => {
  return null !== localStorage.getItem('access_token');
}

const initialState: State = {
  isAuthenticated: checkToken(),
};

// Actions
const LOGIN_ERROR = 'crick/auth/LOGIN_ERROR';
const LOGIN_SUCCESS = 'crick/auth/LOGIN_SUCCESS';
const LOGOUT = 'crick/auth/LOGOUT';

// Listeners
export const addAuth0Listeners = (dispatch: Function, getState: Function) => {
  lock.on('authenticated', authResult => {
    lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) {
        dispatch(loginError(error));

        return;
      }

      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('profile', JSON.stringify(profile));

      dispatch(loginSuccess(profile));
    });
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

const loginSuccess = (profile: Object): Action => {
  return { type: LOGIN_SUCCESS, profile };
};

export const logout = (): Action => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('profile');

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
      };

    case LOGOUT:
      return {
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
