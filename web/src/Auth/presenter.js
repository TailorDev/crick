/* @flow */
import React from 'react';

class Auth extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      login: '',
      token: '',
    };
  }

  props: {
    isAuthenticated: boolean,
    token: string,
    onLogout: Function,
    onLogin: Function,
  };

  state: {
    login: string,
    token: string,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.fetchMe(this.props.token);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      if (nextProps.token !== null) {
        this.fetchMe(nextProps.token);
      } else {
        this.setState({ login: '' });
      }
    }
  }

  // this is old school, we should use redux-api-middleware instead
  fetchMe(token: string) {
    const headers: Object = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    fetch(`${process.env.REACT_APP_API_HOST || ''}/users/me`, { headers })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          login: json.login,
          token: json.token,
        });
      })
    ;
  }

  render() {
    if (this.props.isAuthenticated) {
      return (
        <div>
          <p>
            {this.state.login}
            &nbsp;
            <button onClick={this.props.onLogout}>Logout</button>
          </p>
          <p>
            Watson token: <code>{this.state.token}</code>
          </p>
        </div>
      );
    }

    return (
      <div>
      <button onClick={this.props.onLogin}>Login</button>
      </div>
    );
  }
}

export default Auth;
