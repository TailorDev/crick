/* @flow */
import { connect } from 'react-redux';
import Home from './presenter';

const mapStateToProps = (state) => {
  const { auth } = state;

  return {
    isAuthenticated: auth.isAuthenticated,
  };
};

export default connect(mapStateToProps)(Home);
