/* @flow */
import React from 'react';

type Props = {
  location: {
    pathname: string,
  },
};

const style = {
  textAlign: 'center',
};

const NotFound = (props: Props) =>
  <div style={style}>
    <h1>404 - No page found for <code>{props.location.pathname}</code></h1>
  </div>;

export default NotFound;
