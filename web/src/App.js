/* @flow */
import React, { Component } from 'react';
import auth0 from 'auth0-js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      fullname: '',
    };

    this.webAuth = new auth0.WebAuth({
      domain:       process.env.REACT_APP_AUTH0_DOMAIN,
      clientID:     process.env.REACT_APP_AUTH0_CLIENT_ID,
      scope:        'openid profile',
      audience:     process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      redirectUri : 'http://localhost:3000/'
    });

    (this: any).authenticate = this.authenticate.bind(this);
    (this: any).logout = this.logout.bind(this);
  }

  state: {
    fullname: string,
  };
  webAuth: Object;

  componentDidMount() {
    this.parseHash();

    if (this.isAuthenticated()) {
      const headers: Object = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      };

      fetch('/users/me', { headers })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.setState({
            fullname: json.fullname,
          });
        })
        .catch(console.log)
      ;
    }
  }

  authenticate() {
    this.webAuth.authorize();
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');

    window.location = '/';
  }

  getAccessToken() {
    return localStorage.getItem('access_token') || '';
  }

  isAuthenticated() {
    return localStorage.getItem('access_token') !== null;
  }

  parseHash() {
    const a = new auth0.WebAuth({
      domain:       'tailordev.eu.auth0.com',
      clientID:     'TiSBgqVMGaV47M0HqaENWR9SGp1qpjNT'
    });
    a.parseHash(window.location.hash, function(err, authResult) {
      if (err) {
        console.log(err);

        return;
      }

      if (authResult !== null && authResult.accessToken !== null && authResult.idToken !== null) {
        localStorage.setItem('access_token', authResult.accessToken);
      }
    });
  }

  render() {
    let hello = (
      <p>
        <button onClick={this.authenticate}>Sign In</button>
      </p>
    );

    if (this.isAuthenticated()) {
      hello = (
        <p>
          Hello, <strong>{this.state.fullname || 'Anonymous'}</strong>!
          <br />
          <button onClick={this.logout}>logout</button>
        </p>
      );
    }

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
