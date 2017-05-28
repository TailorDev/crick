/* @flow */
import { connect } from 'react-redux';
import Projects from './presenter';

const mapStateToProps = (state) => {
  const auth = state.auth;

  return {
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
  };
};

export default connect(mapStateToProps)(Projects);
