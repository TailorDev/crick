/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';

type Props = {
  id: string,
  name: string,
};

const Team = (props: Props) =>
  <Paper className="Team">
    <h4>
      <Link to={`/teams/${props.id}`}>{props.name}</Link>
    </h4>
  </Paper>;

export default Team;
