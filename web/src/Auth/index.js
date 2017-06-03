/* @flow */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Auth from './presenter';
import type { Props as AuthProps } from './presenter';
import { selectAuthState, login, logout, fetchUser } from './reducer';

const mapStateToProps = state => {
  const auth = selectAuthState(state);

  return {
    token: auth.api_token,
    avatar_url: auth.avatar_url,
    isAuthenticated: auth.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>, ownProps: AuthProps) => ({
  onLogin: () => dispatch(login()),
  onLogout: () => {
    dispatch(logout());
    // redirect to /
    ownProps.history.push('/');
  },
  fetchUser: () => dispatch(fetchUser()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));
