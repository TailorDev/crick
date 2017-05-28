/* @flow */
import React from 'react';

class Auth extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      login: '',
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

  fetchMe(token: string) {
    const headers: Object = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    fetch('/users/me', { headers })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          login: json.login,
        });
      })
    ;
  }

  render() {
    return (
      <div>
      {this.props.isAuthenticated ?
        <p>
          {this.state.login}
          &nbsp;
          <button onClick={this.props.onLogout}>Logout</button>
        </p>
        :
        <button onClick={this.props.onLogin}>Login</button>
      }
      </div>
    );
  }
}

export default Auth;
