/* @flow */
import React from 'react';

type Props = {
  isAuthenticated: boolean,
  onLogin: Function,
  onLogout: Function,
};

const App = (props: Props) => (
  <div className="App">
    <div className="App-header">
      <h2>Welcome to React</h2>
    </div>
    <div className="App-intro">
      {props.isAuthenticated ? 'You are authenticated' : ''}
    </div>
    {props.isAuthenticated ?
        <button onClick={props.onLogout}>Logout</button>
        :
        <button onClick={props.onLogin}>Login</button>
    }
  </div>
);

export default App;
