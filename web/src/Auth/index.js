/* @flow */
import { connect } from 'react-redux';
import Auth from './presenter';
import { login, logout, fetchUser } from './reducer';

const mapStateToProps = (state) => {
  const auth = state.auth;

  return {
    token: auth.api_token,
    avatar_url: auth.avatar_url,
    isAuthenticated: auth.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onLogin: () => dispatch(login()),
  onLogout: () => dispatch(logout()),
  fetchUser: () => dispatch(fetchUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
