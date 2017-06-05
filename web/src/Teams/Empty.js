/* @flow */
import React from 'react';
import ActionSupervisorIcon from 'material-ui/svg-icons/action/supervisor-account';
import Paper from 'material-ui/Paper';
import style from '../shared/emptyStyle';

type Props = {
  createButton: React$Element<*>,
};

const Empty = ({ createButton }: Props) =>
  <div>
    <Paper style={style.paper} zDepth={1}>
      <ActionSupervisorIcon style={style.icon} color="#5ec3a0" />
      <h4 style={style.title}>No team yet.</h4>
      <p>
        A team allows you to aggregate frames with other users.
        <br />
        Add a new team now by clicking the button below:
      </p>
      {createButton}
    </Paper>
  </div>;

export default Empty;
