/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  id: string,
  name: string,
};

const Project = (props: Props) => (
  <li>
    <Link to={`/projects/${props.id}`}>{props.name}</Link>
  </li>
);

export default Project;
