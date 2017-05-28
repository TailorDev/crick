/* @flow */
import React from 'react';
import Projects from '../Projects';
import Auth from '../Auth';

type Props = {
};

const App = (props: Props) => (
  <div className="App">
    <div className="App-header">
      <h2>crick.io</h2>
    </div>

    <div className="App-intro">
      <Auth />
    </div>

    <Projects />
  </div>
);

export default App;
