/* @flow */
import React from 'react';

import Projects from '../Projects';
import Auth from '../Auth';
import './index.css';


const Home = () => (
  <div className="Home">
      <Auth />
      <Projects />
  </div>
);

export default Home;
