/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';


type Props = {
  id: string,
  name: string,
};

const Project = (props: Props) => (
  <Paper className="Project">
    <h4>
      <Link to={`/projects/${props.id}`}>{props.name}</Link>
    </h4>
  </Paper>
);

export default Project;
