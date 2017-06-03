/* @flow */
import AppBar from 'material-ui/AppBar';
import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../Auth';
import Errors from '../Errors';
import './index.css';

type Props = {
  children: React$Element<*>,
};

const App = (props: Props) =>
  <div className="App">
    <AppBar
      className="App-bar"
      title={<Link to="/">Crick.io</Link>}
      iconElementRight={<Auth />}
      showMenuIconButton={false}
    />
    <div className="App-content">
      {props.children}
    </div>

    <Errors />
  </div>;

export default App;
