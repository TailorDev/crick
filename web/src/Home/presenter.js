/* @flow */
import React from 'react';

import ProjectsList from '../ProjectsList';
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
          <ProjectsList />
          <TeamsList />
        </div>
      : <NotConnected />}
  </div>;

export default Home;
