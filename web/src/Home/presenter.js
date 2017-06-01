/* @flow */
import React from 'react';

import Projects from '../Projects';
import NotConnected from './NotConnected';
import './index.css';

type Props = {
  isAuthenticated: boolean,
};

const Home = ({ isAuthenticated }: Props) => (
  <div className="Home">
    {isAuthenticated ? <Projects /> : <NotConnected />}
  </div>
);

export default Home;
