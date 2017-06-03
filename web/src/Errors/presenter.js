/* @flow */
import React from 'react';
import Snackbar from 'material-ui/Snackbar';

type Props = {
  message: string,
  discard: Function,
};

const Errors = (props: Props) =>
  <Snackbar
    open={props.message !== ''}
    message={props.message}
    autoHideDuration={4000}
    action="discard"
    onActionTouchTap={props.discard}
    onRequestClose={props.discard}
  />;

export default Errors;
