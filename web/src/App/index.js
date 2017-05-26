/* @flow */
import { connect } from 'react-redux';
import App from './presenter';
import { login, logout } from '../auth/reducer';

const mapStateToProps = (state: Object) => {
  const auth = state.auth;

  return {
    isAuthenticated: auth.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onLogin: () => dispatch(login()),
  onLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
