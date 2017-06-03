/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

type Props = {
  location: {
    pathname: string,
  },
};

const NotFound = (props: Props) =>
  <div className="NotFound">
    <h1>404 - No page found for <code>{props.location.pathname}</code></h1>
    <p>
      <Link to="/">Back to Home</Link>
    </p>
  </div>;

export default NotFound;
