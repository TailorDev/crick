/* @flow */
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      fullname: '',
    };
  }

  state: {
    fullname: string,
  };

  componentDidMount() {
    fetch('/users/me')
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          fullname: json.fullname,
        });
      });
  }

  render() {
    const hello = this.state.fullname === '' ? '' : (
      <p>
        Hello, <strong>{this.state.fullname}</strong>!
      </p>
    );

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          {hello}
        </div>
      </div>
    );
  }
}

export default App;
