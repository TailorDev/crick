/* @flow */
import { connect } from 'react-redux';
import Test from './presenter';

const mapStateToProps = (state) => {
  const auth = state.auth;

  return {
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);
