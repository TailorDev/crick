/* @flow */
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import './style.css';

type Props = {
  message: string,
};

const Loading = (props: Props) =>
  <div className="Loading">
    <CircularProgress size={80} thickness={5} />
    <h3>{props.message}</h3>
  </div>;

export default Loading;
