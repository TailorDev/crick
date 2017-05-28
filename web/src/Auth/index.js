/* @flow */
import { connect } from 'react-redux';
import Auth from './presenter';
import { login, logout } from './reducer';

const mapStateToProps = (state) => {
  const auth = state.auth;

  return {
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onLogin: () => dispatch(login()),
  onLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
