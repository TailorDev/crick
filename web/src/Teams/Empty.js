/* @flow */
import React from 'react';
import ActionSupervisorIcon from 'material-ui/svg-icons/action/supervisor-account';
import Paper from 'material-ui/Paper';

type Props = {
};

const style = {
  paper: {
    width: '60%',
    margin: '10px 20% 10px 20%',
    padding: '20px',
    textAlign: 'center',
  },
  icon: {
    height: '80px',
    width: '80px',
  },
  title: {
    marginTop: 0,
  },
};

const Empty = (props: Props) => (
  <div>
    <Paper style={style.paper} zDepth={1}>
      <ActionSupervisorIcon
        style={style.icon}
        color="#5ec3a0"
      />
      <h4 style={style.title}>No teams yet.</h4>
      <p>
        A team allows you to aggregate frames with other users.
        <br />
        Add a new team now by clicking the + button in the bottom right corner.
      </p>
    </Paper>
  </div>
);

export default Empty;
