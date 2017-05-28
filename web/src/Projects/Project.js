/* @flow */
import React from 'react';

type Props = {
  name: string,
};

const Project = (props: Props) => (
  <li>{props.name}</li>
);

export default Project;
