/* @flow */
import { connect } from 'react-redux';
import Errors from './presenter';
import { discard } from './reducer';

const mapStateToProps = state => {
  const { errors } = state;

  return {
    message: errors.message,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  discard: () => dispatch(discard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Errors);
