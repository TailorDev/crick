/* @flow */
import React from 'react';

import Projects from '../Projects';
import TeamsList from '../TeamsList';
import NotConnected from './NotConnected';
import './index.css';

type Props = {
  isAuthenticated: boolean,
};

const Home = ({ isAuthenticated }: Props) =>
  <div className="Home">
    {isAuthenticated
      ? <div>
          <Projects />
          <TeamsList />
        </div>
      : <NotConnected />}
  </div>;

export default Home;
